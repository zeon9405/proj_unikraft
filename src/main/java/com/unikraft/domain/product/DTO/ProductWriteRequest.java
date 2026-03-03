package com.unikraft.domain.product.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ProductWriteRequest {
    private Integer categoryId;
    private String pdName;
    private Integer pdPrice;
    private Integer pdCnt;
    private Integer status;
    private String keyword;
    private String contents;
    private String imgUrl;
}
