package com.unikraft.domain.order.dto;

import com.unikraft.domain.order.Order;
import com.unikraft.domain.order.OrderItem;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class OrderDetailResponse {
    private final Integer id;
    private final Integer status;
    private final Integer totalAmount;
    private final LocalDateTime createdAt;
    private final String receiverName;
    private final String receiverTel;
    private final String address;
    private final String addressDetail;
    private final String zipCode;
    private final List<OrderItemDetailDto> items;

    public OrderDetailResponse(Order order) {
        this.id = order.getId();
        this.status = order.getStatus();
        this.totalAmount = order.getTotalAmount();
        this.createdAt = order.getCreatedAt();
        this.receiverName = order.getReceiverName();
        this.receiverTel = order.getReceiverTel();
        this.address = order.getAddress();
        this.addressDetail = order.getAddressDetail();
        this.zipCode = order.getZipCode();
        this.items = order.getOrderItems().stream()
                .map(OrderItemDetailDto::new)
                .toList();
    }

    @Getter
    public static class OrderItemDetailDto {
        private final Integer pdId;
        private final String pdName;
        private final String imgUrl;
        private final Integer qty;
        private final Integer price;

        public OrderItemDetailDto(OrderItem item) {
            this.pdId = item.getProduct().getPdId();
            this.pdName = item.getProduct().getPdName();
            this.imgUrl = item.getProduct().getImgUrl();
            this.qty = item.getQty();
            this.price = item.getPrice();
        }
    }
}
