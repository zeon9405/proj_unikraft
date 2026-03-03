package com.unikraft.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindPwRequest {
    private String name;
    private String loginId;
    private String email;
}
