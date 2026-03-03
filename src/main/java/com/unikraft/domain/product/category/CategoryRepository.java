package com.unikraft.domain.product.category;

import com.unikraft.domain.product.category.dto.CategoryTopResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT new com.unikraft.domain.product.category.dto.CategoryTopResponse(c.categoryId, c.categoryName, c.categoryDesc, c.imgUrl, COUNT(p)) " +
           "FROM Category c LEFT JOIN Product p ON p.category = c " +
           "GROUP BY c.categoryId, c.categoryName, c.categoryDesc, c.imgUrl ORDER BY COUNT(p) DESC")
    List<CategoryTopResponse> findTop5WithProductCount(Pageable pageable);
}
