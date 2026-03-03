package com.unikraft.domain.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FindIdRequest {
    private String name;
    private String email;
}
