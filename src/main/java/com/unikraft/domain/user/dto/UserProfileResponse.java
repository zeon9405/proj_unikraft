package com.unikraft.domain.user.dto;

import com.unikraft.domain.user.User;
import lombok.Getter;

@Getter
public class UserProfileResponse {
    private final Integer userId;
    private final String name;
    private final String loginId;
    private final String email;
    private final String tel;
    private final Integer role;
    private final String major;
    private final String brand;
    private final String contents;
    private final String imgUrl;

    public UserProfileResponse(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.loginId = user.getLoginId();
        this.email = user.getEmail();
        this.tel = user.getTel();
        this.role = user.getRole();
        this.major = user.getMajor();
        this.brand = user.getBrand();
        this.contents = user.getContents();
        this.imgUrl = user.getImgUrl();
    }
}
