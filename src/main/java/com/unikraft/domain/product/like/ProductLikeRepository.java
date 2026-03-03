package com.unikraft.domain.product.like;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductLikeRepository extends JpaRepository<ProductLike, Integer> {

    boolean existsByUserUserIdAndProductPdId(Integer userId, Integer pdId);

    void deleteByUserUserIdAndProductPdId(Integer userId, Integer pdId);

    @Query("SELECT pl.product.pdId FROM ProductLike pl WHERE pl.user.userId = :userId")
    List<Integer> findProductIdsByUserId(@Param("userId") Integer userId);
}
