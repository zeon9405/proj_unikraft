package com.unikraft.domain.order;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    List<Order> findByUserUserIdOrderByCreatedAtDesc(Integer userId);

    List<Order> findAllByOrderByCreatedAtDesc();
}
