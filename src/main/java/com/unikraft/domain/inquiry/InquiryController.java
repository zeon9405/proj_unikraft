package com.unikraft.domain.inquiry;

import com.unikraft.domain.inquiry.dto.InquiryListResponse;
import com.unikraft.domain.inquiry.dto.InquiryRequest;
import com.unikraft.domain.inquiry.dto.InquiryViewResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inquiry")
public class InquiryController {

    private final InquiryService inquiryService;

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Integer)) {
            throw new SecurityException("인증이 필요합니다.");
        }
        return (Integer) auth.getPrincipal();
    }

    private Integer getCurrentUserIdOptional() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof Integer) {
            return (Integer) auth.getPrincipal();
        }
        return null;
    }

    @GetMapping("/list")
    public ResponseEntity<List<InquiryListResponse>> getList() {
        return ResponseEntity.ok(inquiryService.getList());
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> getView(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(inquiryService.getView(id, getCurrentUserIdOptional()));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body("비밀글에 접근할 수 없습니다.");
        }
    }

    @PostMapping("/write")
    public ResponseEntity<Void> write(@RequestBody InquiryRequest req) {
        inquiryService.write(getCurrentUserId(), req);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        try {
            inquiryService.delete(id, getCurrentUserId());
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<InquiryListResponse>> getMyList() {
        return ResponseEntity.ok(inquiryService.getMyList(getCurrentUserId()));
    }
}
