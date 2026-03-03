package com.unikraft.domain.cart;

import com.unikraft.domain.cart.dto.CartItemResponse;
import com.unikraft.domain.product.Product;
import com.unikraft.domain.product.ProductRepository;
import com.unikraft.domain.user.User;
import com.unikraft.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public List<CartItemResponse> getMyCart(Integer userId) {
        return cartRepository.findByUserUserId(userId).stream()
                .map(CartItemResponse::new)
                .toList();
    }

    public int getMyCartCount(Integer userId) {
        return cartRepository.findByUserUserId(userId).stream()
                .mapToInt(Cart::getQty)
                .sum();
    }

    @Transactional
    public void addOrUpdate(Integer userId, Integer pdId, int qty) {
        Optional<Cart> existing = cartRepository.findByUserUserIdAndProductPdId(userId, pdId);
        if (existing.isPresent()) {
            Cart cart = existing.get();
            cart.setQty(cart.getQty() + qty);
        } else {
            User user = userRepository.findByUserId(userId)
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
            Product product = productRepository.findById(pdId)
                    .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
            cartRepository.save(Cart.builder()
                    .user(user)
                    .product(product)
                    .qty(qty)
                    .build());
        }
    }

    @Transactional
    public void updateQty(Integer userId, Integer pdId, int qty) {
        Cart cart = cartRepository.findByUserUserIdAndProductPdId(userId, pdId)
                .orElseThrow(() -> new IllegalArgumentException("장바구니 항목을 찾을 수 없습니다."));
        if (qty <= 0) {
            cartRepository.delete(cart);
        } else {
            cart.setQty(qty);
        }
    }

    @Transactional
    public void remove(Integer userId, Integer pdId) {
        cartRepository.deleteByUserUserIdAndProductPdId(userId, pdId);
    }
}
