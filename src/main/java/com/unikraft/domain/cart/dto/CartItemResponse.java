package com.unikraft.domain.cart.dto;

import com.unikraft.domain.cart.Cart;
import lombok.Getter;

@Getter
public class CartItemResponse {

    private final Integer id;
    private final Integer pdId;
    private final String pdName;
    private final Integer pdPrice;
    private final String imgUrl;
    private final String userName;
    private final String categoryName;
    private final Integer qty;

    public CartItemResponse(Cart cart) {
        this.id = cart.getId();
        this.pdId = cart.getProduct().getPdId();
        this.pdName = cart.getProduct().getPdName();
        this.pdPrice = cart.getProduct().getPdPrice();
        this.imgUrl = cart.getProduct().getImgUrl();
        this.userName = cart.getProduct().getUser().getName();
        this.categoryName = cart.getProduct().getCategory() != null
                ? cart.getProduct().getCategory().getCategoryName() : null;
        this.qty = cart.getQty();
    }
}
