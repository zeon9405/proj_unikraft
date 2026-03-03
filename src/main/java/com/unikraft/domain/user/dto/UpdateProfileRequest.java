package com.unikraft.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    private String name;
    private String email;
    private String tel;
    private String pw;          // 빈 문자열이면 변경 안 함
    private String major;       // 장인 전용
    private String brand;       // 장인 전용
    private String contents;    // 장인 전용
    private String imgUrl;      // 장인 전용
}
