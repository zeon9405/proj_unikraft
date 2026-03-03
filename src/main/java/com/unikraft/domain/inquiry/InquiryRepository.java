package com.unikraft.domain.inquiry;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Integer> {
    List<Inquiry> findAllByOrderByCreatedAtDesc();
    List<Inquiry> findByUserUserIdOrderByCreatedAtDesc(Integer userId);
}
