package com.unikraft.domain.product.category;

import com.unikraft.domain.product.category.dto.CategoryTopResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/category")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/all")
    public ResponseEntity<List<Category>> categoryList() {
        return ResponseEntity.ok(categoryService.findAll());
    }

    @GetMapping("/top5")
    public ResponseEntity<List<CategoryTopResponse>> top5Categories() {
        return ResponseEntity.ok(categoryService.getTop5WithCount());
    }
}
