package com.unikraft.domain.product.category.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CategoryTopResponse {
    private Integer categoryId;
    private String categoryName;
    private String categoryDesc;
    private String imgUrl;
    private Long productCount;
}
