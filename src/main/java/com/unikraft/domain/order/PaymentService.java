package com.unikraft.domain.order;

import com.unikraft.domain.order.dto.PaymentConfirmRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.util.Base64;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    @Value("${toss.secret-key}")
    private String secretKey;

    private final OrderService orderService;

    public void confirmPayment(PaymentConfirmRequest req) {
        // 토스 orderId에서 실제 orderId 파싱: "order-123" → 123
        String tossOrderId = req.getOrderId();
        Integer orderId = Integer.parseInt(tossOrderId.replace("order-", ""));

        // 이미 결제 완료된 주문이면 토스 API 재호출 없이 바로 리턴 (StrictMode 이중 실행 방어)
        if (orderService.isAlreadyConfirmed(orderId)) {
            return;
        }

        // 토스 결제 승인 API 호출
        String credentials = Base64.getEncoder().encodeToString((secretKey + ":").getBytes());

        RestClient restClient = RestClient.create();
        try {
            restClient.post()
                    .uri("https://api.tosspayments.com/v1/payments/confirm")
                    .header("Authorization", "Basic " + credentials)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "paymentKey", req.getPaymentKey(),
                            "orderId", tossOrderId,
                            "amount", req.getAmount()
                    ))
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException e) {
            String body = e.getResponseBodyAsString();
            // DUPLICATED_ORDER_ID = race condition으로 이미 승인 완료된 상태 → DB 처리만 진행
            if (!body.contains("DUPLICATED_ORDER_ID")) {
                throw new IllegalStateException("토스 결제 승인 실패: " + body);
            }
        }

        // DB 처리 (금액 검증, 재고 차감, 장바구니 삭제) - 멱등성 보장 (이미 status=1이면 내부에서 return)
        orderService.confirmPayment(orderId, req.getPaymentKey(), req.getAmount());
    }
}
