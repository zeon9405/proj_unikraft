package com.unikraft.domain.product.dto;

import com.unikraft.domain.product.Product;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ProductMainCardFormResponse {
    // Product 모든 컬럼
    private Integer pdId;
    private String pdName;
    private Integer pdPrice;
    private Integer pdCnt;
    private Integer status;
    private String keyword;
    private String contents;
    private String imgUrl;
    private Integer likeCnt;
    private LocalDateTime regDate;

    // User 테이블에서 가져올 컬럼
    private String userName;
    private String major;


    // 엔티티를 받아 DTO로 변환하는 생성자
    public ProductMainCardFormResponse(Product product) {
        this.pdId = product.getPdId();
        this.pdName = product.getPdName();
        this.pdPrice = product.getPdPrice();
        this.pdCnt = product.getPdCnt();
        this.status = product.getStatus();
        this.keyword = product.getKeyword();
        this.contents = product.getContents();
        this.imgUrl = product.getImgUrl();
        this.likeCnt = product.getLikeCnt();
        this.regDate = product.getRegDate();

        // 연관된 User 엔티티가 있을 경우에만 값을 추출 (Null 방지)
        if (product.getUser() != null) {
            this.userName = product.getUser().getName();
            this.major = product.getUser().getMajor();
        }

    }
}
