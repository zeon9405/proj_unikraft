package com.unikraft.domain.cart;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByUserUserId(Integer userId);

    Optional<Cart> findByUserUserIdAndProductPdId(Integer userId, Integer pdId);

    void deleteByUserUserIdAndProductPdId(Integer userId, Integer pdId);
}
