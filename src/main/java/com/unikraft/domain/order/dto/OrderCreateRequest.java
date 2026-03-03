package com.unikraft.domain.order.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderCreateRequest {
    private String receiverName;
    private String receiverTel;
    private String address;
    private String addressDetail;
    private String zipCode;
    private List<OrderItemDto> items;
}
