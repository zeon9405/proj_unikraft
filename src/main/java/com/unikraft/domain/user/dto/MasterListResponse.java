package com.unikraft.domain.user.dto;

import com.unikraft.domain.user.User;
import lombok.Getter;

@Getter
public class MasterListResponse {
    private Integer userId;
    private String name;
    private String major;
    private String brand;
    private String contents;
    private String imgUrl;
    private Integer productCount;
    private Integer totalSaleCnt;

    public MasterListResponse(User user, int productCount, int totalSaleCnt) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.major = user.getMajor();
        this.brand = user.getBrand();
        this.contents = user.getContents();
        this.imgUrl = user.getImgUrl();
        this.productCount = productCount;
        this.totalSaleCnt = totalSaleCnt;
    }
}
