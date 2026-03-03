package com.unikraft.domain.product;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {

    List<Product> findTop4ByOrderByLikeCntDesc();
    List<Product> findTop4ByOrderByRegDateDesc();
    List<Product> findTop12ByOrderByRegDateDesc();

    List<Product> findByCategoryCategoryId(Integer categoryId);
    List<Product> findByUserUserId(Integer userId);
}
