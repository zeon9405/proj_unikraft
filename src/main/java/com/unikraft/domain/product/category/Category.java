package com.unikraft.domain.product.category;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @Column(name = "category_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer categoryId;

    @Column(name = "category_name", length = 45)
    private String categoryName;

    @Column(name = "category_desc", length = 255)
    private String categoryDesc;

    @Column(name = "img_url", length = 500)
    private String imgUrl;
}
