package com.unikraft.domain.product.like;

import com.unikraft.domain.product.dto.ProductListResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/like")
public class ProductLikeController {

    private final ProductLikeService productLikeService;

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Integer)) {
            throw new SecurityException("인증이 필요합니다.");
        }
        return (Integer) auth.getPrincipal();
    }

    @PostMapping("/{pdId}")
    public ResponseEntity<Void> addLike(@PathVariable Integer pdId) {
        productLikeService.addLike(getCurrentUserId(), pdId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{pdId}")
    public ResponseEntity<Void> removeLike(@PathVariable Integer pdId) {
        productLikeService.removeLike(getCurrentUserId(), pdId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<Integer>> getMyLikedIds() {
        return ResponseEntity.ok(productLikeService.getMyLikedIds(getCurrentUserId()));
    }

    @GetMapping("/my/products")
    public ResponseEntity<List<ProductListResponse>> getMyLikedProducts() {
        return ResponseEntity.ok(productLikeService.getMyLikedProducts(getCurrentUserId()));
    }
}
