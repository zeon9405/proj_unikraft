package com.unikraft.domain.order.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class OrderCreateResponse {
    private Integer orderId;
    private String tossOrderId;    // "order-{id}"
    private Integer totalAmount;
}
