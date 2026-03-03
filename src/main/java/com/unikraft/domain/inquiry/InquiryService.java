package com.unikraft.domain.inquiry;

import com.unikraft.domain.inquiry.dto.InquiryListResponse;
import com.unikraft.domain.inquiry.dto.InquiryRequest;
import com.unikraft.domain.inquiry.dto.InquiryViewResponse;
import com.unikraft.domain.user.User;
import com.unikraft.domain.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class InquiryService {

    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;

    public List<InquiryListResponse> getList() {
        return inquiryRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(InquiryListResponse::new)
                .collect(Collectors.toList());
    }

    public InquiryViewResponse getView(Integer inquiryId, Integer requestUserId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new EntityNotFoundException("문의를 찾을 수 없습니다."));

        if (Boolean.TRUE.equals(inquiry.getIsSecret())) {
            Integer ownerId = inquiry.getUser() != null ? inquiry.getUser().getUserId() : null;
            if (!ownerId.equals(requestUserId)) {
                throw new SecurityException("비밀글에 접근할 수 없습니다.");
            }
        }
        return new InquiryViewResponse(inquiry);
    }

    public void write(Integer userId, InquiryRequest req) {
        User user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        Inquiry inquiry = Inquiry.builder()
                .user(user)
                .title(req.getTitle())
                .content(req.getContent())
                .isSecret(Boolean.TRUE.equals(req.getIsSecret()))
                .createdAt(LocalDateTime.now())
                .build();
        inquiryRepository.save(inquiry);
    }

    public void delete(Integer inquiryId, Integer requestUserId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId)
                .orElseThrow(() -> new EntityNotFoundException("문의를 찾을 수 없습니다."));
        Integer ownerId = inquiry.getUser() != null ? inquiry.getUser().getUserId() : null;
        if (!ownerId.equals(requestUserId)) {
            throw new SecurityException("삭제 권한이 없습니다.");
        }
        inquiryRepository.delete(inquiry);
    }

    public List<InquiryListResponse> getMyList(Integer userId) {
        return inquiryRepository.findByUserUserIdOrderByCreatedAtDesc(userId).stream()
                .map(InquiryListResponse::new)
                .collect(Collectors.toList());
    }
}
