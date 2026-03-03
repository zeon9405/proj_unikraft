package com.unikraft.domain.product.like;

import com.unikraft.domain.product.Product;
import com.unikraft.domain.product.ProductRepository;
import com.unikraft.domain.product.dto.ProductListResponse;
import com.unikraft.domain.user.User;
import com.unikraft.domain.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductLikeService {

    private final ProductLikeRepository productLikeRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public void addLike(Integer userId, Integer pdId) {
        if (productLikeRepository.existsByUserUserIdAndProductPdId(userId, pdId)) {
            return;
        }
        User user = userRepository.findById(userId.longValue())
                .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다."));
        Product product = productRepository.findById(pdId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));

        ProductLike like = ProductLike.builder()
                .user(user)
                .product(product)
                .regDate(LocalDateTime.now())
                .build();
        productLikeRepository.save(like);

        if (product.getLikeCnt() == null) {
            product.setLikeCnt(1);
        } else {
            product.setLikeCnt(product.getLikeCnt() + 1);
        }
        productRepository.save(product);
    }

    public void removeLike(Integer userId, Integer pdId) {
        if (!productLikeRepository.existsByUserUserIdAndProductPdId(userId, pdId)) {
            return;
        }
        productLikeRepository.deleteByUserUserIdAndProductPdId(userId, pdId);

        Product product = productRepository.findById(pdId)
                .orElseThrow(() -> new EntityNotFoundException("상품을 찾을 수 없습니다."));
        if (product.getLikeCnt() != null && product.getLikeCnt() > 0) {
            product.setLikeCnt(product.getLikeCnt() - 1);
        }
        productRepository.save(product);
    }

    public List<Integer> getMyLikedIds(Integer userId) {
        return productLikeRepository.findProductIdsByUserId(userId);
    }

    public List<ProductListResponse> getMyLikedProducts(Integer userId) {
        List<Integer> ids = productLikeRepository.findProductIdsByUserId(userId);
        return ids.stream()
                .map(id -> productRepository.findById(id).orElse(null))
                .filter(Objects::nonNull)
                .map(ProductListResponse::new)
                .collect(Collectors.toList());
    }

    public boolean isLiked(Integer userId, Integer pdId) {
        return productLikeRepository.existsByUserUserIdAndProductPdId(userId, pdId);
    }
}
