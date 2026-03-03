package com.unikraft.domain.order;

import com.unikraft.domain.order.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/order")
public class OrderController {

    private final OrderService orderService;

    private Integer getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || !(auth.getPrincipal() instanceof Integer)) {
            throw new SecurityException("인증이 필요합니다.");
        }
        return (Integer) auth.getPrincipal();
    }

    @PostMapping
    public ResponseEntity<OrderCreateResponse> createOrder(@RequestBody OrderCreateRequest req) {
        return ResponseEntity.ok(orderService.createOrder(getCurrentUserId(), req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderListResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders(getCurrentUserId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailResponse> getOrderDetail(@PathVariable Integer id) {
        return ResponseEntity.ok(orderService.getOrderDetail(id, getCurrentUserId()));
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable Integer id) {
        orderService.cancelOrder(id, getCurrentUserId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<OrderListResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
}
