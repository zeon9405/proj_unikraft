package com.unikraft.domain.inquiry.dto;

import com.unikraft.domain.inquiry.Inquiry;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class InquiryViewResponse {
    private final Integer inquiryId;
    private final String title;
    private final String content;
    private final Boolean isSecret;
    private final String userName;
    private final Integer userId;
    private final LocalDateTime createdAt;
    private final String answer;
    private final LocalDateTime answeredAt;

    public InquiryViewResponse(Inquiry inquiry) {
        this.inquiryId = inquiry.getInquiryId();
        this.title = inquiry.getTitle();
        this.content = inquiry.getContent();
        this.isSecret = inquiry.getIsSecret();
        this.userName = inquiry.getUser() != null ? inquiry.getUser().getName() : "알 수 없음";
        this.userId = inquiry.getUser() != null ? inquiry.getUser().getUserId() : null;
        this.createdAt = inquiry.getCreatedAt();
        this.answer = inquiry.getAnswer();
        this.answeredAt = inquiry.getAnsweredAt();
    }
}
