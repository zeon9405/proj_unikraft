package com.unikraft.domain.order.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentConfirmRequest {
    private String paymentKey;
    private String orderId;    // "order-{id}"
    private Integer amount;
}
