package com.unikraft.domain.inquiry.dto;

import com.unikraft.domain.inquiry.Inquiry;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class InquiryListResponse {
    private final Integer inquiryId;
    private final String title;
    private final Boolean isSecret;
    private final String userName;
    private final Integer userId;
    private final LocalDateTime createdAt;
    private final boolean answered;

    public InquiryListResponse(Inquiry inquiry) {
        this.inquiryId = inquiry.getInquiryId();
        this.isSecret = inquiry.getIsSecret();
        this.title = Boolean.TRUE.equals(inquiry.getIsSecret()) ? "🔒 비밀글입니다." : inquiry.getTitle();
        this.userName = inquiry.getUser() != null ? inquiry.getUser().getName() : "알 수 없음";
        this.userId = inquiry.getUser() != null ? inquiry.getUser().getUserId() : null;
        this.createdAt = inquiry.getCreatedAt();
        this.answered = inquiry.getAnswer() != null && !inquiry.getAnswer().isBlank();
    }
}
