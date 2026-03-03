package com.unikraft.domain.order.dto;

import com.unikraft.domain.order.Order;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OrderListResponse {
    private final Integer id;
    private final Integer status;
    private final Integer totalAmount;
    private final LocalDateTime createdAt;
    private final String firstItemName;
    private final int itemCount;

    public OrderListResponse(Order order) {
        this.id = order.getId();
        this.status = order.getStatus();
        this.totalAmount = order.getTotalAmount();
        this.createdAt = order.getCreatedAt();
        this.firstItemName = order.getOrderItems().isEmpty()
                ? ""
                : order.getOrderItems().get(0).getProduct().getPdName();
        this.itemCount = order.getOrderItems().size();
    }
}
