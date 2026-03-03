package com.unikraft.domain.product.dto;

import com.unikraft.domain.product.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProductListResponse {
    private Integer pdId;
    private String pdName;
    private Integer pdPrice;
    private Integer pdCnt;
    private Integer status;
    private String imgUrl;
    private Integer likeCnt;
    private Integer saleCnt;
    private LocalDateTime regDate;

    // User
    private String userName;
    private String major;

    // Category
    private Integer categoryId;
    private String categoryName;

    public ProductListResponse(Product product) {
        this.pdId = product.getPdId();
        this.pdName = product.getPdName();
        this.pdPrice = product.getPdPrice();
        this.pdCnt = product.getPdCnt();
        this.status = product.getStatus();
        this.imgUrl = product.getImgUrl();
        this.likeCnt = product.getLikeCnt();
        this.saleCnt = product.getSaleCnt();
        this.regDate = product.getRegDate();

        if (product.getUser() != null) {
            this.userName = product.getUser().getName();
            this.major = product.getUser().getMajor();
        }
        if (product.getCategory() != null) {
            this.categoryId = product.getCategory().getCategoryId();
            this.categoryName = product.getCategory().getCategoryName();
        }
    }
}
