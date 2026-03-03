package com.unikraft.domain.user.dto;

import com.unikraft.domain.product.dto.ProductMainCardFormResponse;
import com.unikraft.domain.user.User;
import lombok.Getter;

import java.util.List;

@Getter
public class MasterViewResponse {
    private Integer userId;
    private String name;
    private String major;
    private String brand;
    private String contents;
    private String imgUrl;
    private Integer productCount;
    private Integer totalSaleCnt;
    private List<ProductMainCardFormResponse> top4Products;

    public MasterViewResponse(User user, int productCount, int totalSaleCnt,
                               List<ProductMainCardFormResponse> top4Products) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.major = user.getMajor();
        this.brand = user.getBrand();
        this.contents = user.getContents();
        this.imgUrl = user.getImgUrl();
        this.productCount = productCount;
        this.totalSaleCnt = totalSaleCnt;
        this.top4Products = top4Products;
    }
}
