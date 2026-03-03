package com.unikraft.domain.cart;

import com.unikraft.domain.cart.dto.CartItemResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Integer)) {
            throw new SecurityException("인증이 필요합니다.");
        }
        return (Integer) auth.getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getMyCart() {
        return ResponseEntity.ok(cartService.getMyCart(getCurrentUserId()));
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getMyCartCount() {
        return ResponseEntity.ok(Map.of("count", cartService.getMyCartCount(getCurrentUserId())));
    }

    @PostMapping("/{pdId}")
    public ResponseEntity<Void> addToCart(
            @PathVariable Integer pdId,
            @RequestParam(defaultValue = "1") int qty) {
        cartService.addOrUpdate(getCurrentUserId(), pdId, qty);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{pdId}")
    public ResponseEntity<Void> updateQty(
            @PathVariable Integer pdId,
            @RequestParam int qty) {
        cartService.updateQty(getCurrentUserId(), pdId, qty);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{pdId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Integer pdId) {
        cartService.remove(getCurrentUserId(), pdId);
        return ResponseEntity.ok().build();
    }
}
