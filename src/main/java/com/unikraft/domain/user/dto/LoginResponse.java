package com.unikraft.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {
    private Integer userId;
    private String name;
    private Integer role;
    private String token;
}
