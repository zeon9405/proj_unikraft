package com.unikraft.domain.product.category;

import com.unikraft.domain.product.category.dto.CategoryTopResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public List<CategoryTopResponse> getTop5WithCount() {
        return categoryRepository.findTop5WithProductCount(PageRequest.of(0, 5));
    }
}
