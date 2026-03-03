package com.unikraft.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRequest {
    private String name;
    private String loginId;
    private String pw;
    private String email;
    private String tel;
    private Integer role;
    private String major;
    private String brand;
    private String contents;
    private String imgUrl;
}
