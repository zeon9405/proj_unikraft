package com.unikraft.domain.product.dto;

import com.unikraft.domain.product.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProductViewResponse {
    private Integer pdId;
    private String pdName;
    private Integer pdPrice;
    private Integer pdCnt;
    private Integer status;
    private String keyword;
    private String contents;
    private String imgUrl;
    private Integer likeCnt;
    private Integer saleCnt;
    private LocalDateTime regDate;

    // User
    private Integer userId;
    private String userName;
    private String userImgUrl;
    private String userMajor;
    private String userBrand;

    // Category
    private Integer categoryId;
    private String categoryName;
    private String categoryDesc;

    public ProductViewResponse(Product product) {
        this.pdId = product.getPdId();
        this.pdName = product.getPdName();
        this.pdPrice = product.getPdPrice();
        this.pdCnt = product.getPdCnt();
        this.status = product.getStatus();
        this.keyword = product.getKeyword();
        this.contents = product.getContents();
        this.imgUrl = product.getImgUrl();
        this.likeCnt = product.getLikeCnt();
        this.saleCnt = product.getSaleCnt();
        this.regDate = product.getRegDate();

        if (product.getUser() != null) {
            this.userId = product.getUser().getUserId();
            this.userName = product.getUser().getName();
            this.userImgUrl = product.getUser().getImgUrl();
            this.userMajor = product.getUser().getMajor();
            this.userBrand = product.getUser().getBrand();
        }
        if (product.getCategory() != null) {
            this.categoryId = product.getCategory().getCategoryId();
            this.categoryName = product.getCategory().getCategoryName();
            this.categoryDesc = product.getCategory().getCategoryDesc();
        }
    }
}
