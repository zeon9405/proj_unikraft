package com.unikraft.domain.inquiry.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InquiryRequest {
    private String title;
    private String content;
    private Boolean isSecret;
}
