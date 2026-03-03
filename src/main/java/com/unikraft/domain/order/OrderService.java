package com.unikraft.domain.order;

import com.unikraft.domain.cart.CartRepository;
import com.unikraft.domain.order.dto.*;
import com.unikraft.domain.product.Product;
import com.unikraft.domain.product.ProductRepository;
import com.unikraft.domain.user.User;
import com.unikraft.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;

    @Transactional
    public OrderCreateResponse createOrder(Integer userId, OrderCreateRequest req) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 재고 사전 체크 및 총 금액 계산
        int subtotal = 0;
        for (OrderItemDto itemDto : req.getItems()) {
            Product product = productRepository.findById(itemDto.getPdId())
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다: " + itemDto.getPdId()));
            if (product.getPdCnt() < itemDto.getQty()) {
                throw new IllegalStateException("재고가 부족합니다: " + product.getPdName());
            }
            subtotal += product.getPdPrice() * itemDto.getQty();
        }

        // 배송비 계산 (5만원 미만 3000원)
        int shipping = subtotal < 50000 ? 3000 : 0;
        int totalAmount = subtotal + shipping;

        // 주문 생성 (status=0: 결제 대기)
        Order order = Order.builder()
                .user(user)
                .status(0)
                .totalAmount(totalAmount)
                .receiverName(req.getReceiverName())
                .receiverTel(req.getReceiverTel())
                .address(req.getAddress())
                .addressDetail(req.getAddressDetail())
                .zipCode(req.getZipCode())
                .createdAt(LocalDateTime.now())
                .build();
        orderRepository.save(order);

        // 주문 아이템 저장
        for (OrderItemDto itemDto : req.getItems()) {
            Product product = productRepository.findById(itemDto.getPdId()).get();
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .qty(itemDto.getQty())
                    .price(product.getPdPrice())
                    .build();
            orderItemRepository.save(orderItem);
            order.getOrderItems().add(orderItem);
        }

        return new OrderCreateResponse(order.getId(), "order-" + order.getId(), totalAmount);
    }

    @Transactional
    public void confirmPayment(Integer orderId, String paymentKey, Integer paidAmount) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        // 이미 처리된 주문이면 중복 처리 방지
        if (order.getStatus().equals(1)) {
            return;
        }

        // 금액 검증
        if (!order.getTotalAmount().equals(paidAmount)) {
            throw new IllegalStateException("결제 금액이 일치하지 않습니다.");
        }

        // 재고 차감 및 장바구니 삭제
        Integer userId = order.getUser().getUserId();
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            int newCnt = product.getPdCnt() - item.getQty();
            if (newCnt < 0) {
                throw new IllegalStateException("재고가 부족합니다: " + product.getPdName());
            }
            product.setPdCnt(newCnt);
            product.setSaleCnt((product.getSaleCnt() == null ? 0 : product.getSaleCnt()) + item.getQty());
            productRepository.save(product);

            // 장바구니에서 해당 상품 삭제
            cartRepository.deleteByUserUserIdAndProductPdId(userId, product.getPdId());
        }

        // 주문 상태 업데이트
        order.setStatus(1);
        order.setPaymentKey(paymentKey);
        orderRepository.save(order);
    }

    @Transactional
    public void cancelOrder(Integer orderId, Integer userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        if (!order.getUser().getUserId().equals(userId)) {
            throw new SecurityException("본인의 주문만 취소할 수 있습니다.");
        }
        if (!order.getStatus().equals(1)) {
            throw new IllegalStateException("결제 완료 상태인 주문만 취소할 수 있습니다.");
        }

        // 재고 원상복구
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setPdCnt(product.getPdCnt() + item.getQty());
            product.setSaleCnt(Math.max(0, (product.getSaleCnt() == null ? 0 : product.getSaleCnt()) - item.getQty()));
            productRepository.save(product);
        }

        order.setStatus(2);
        orderRepository.save(order);
    }

    public boolean isAlreadyConfirmed(Integer orderId) {
        return orderRepository.findById(orderId)
                .map(o -> o.getStatus().equals(1))
                .orElse(false);
    }

    public List<OrderListResponse> getMyOrders(Integer userId) {
        return orderRepository.findByUserUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderListResponse::new)
                .toList();
    }

    public OrderDetailResponse getOrderDetail(Integer orderId, Integer userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));
        if (!order.getUser().getUserId().equals(userId)) {
            throw new SecurityException("본인의 주문만 조회할 수 있습니다.");
        }
        return new OrderDetailResponse(order);
    }

    public List<OrderListResponse> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(OrderListResponse::new)
                .toList();
    }
}
