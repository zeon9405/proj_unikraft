package com.unikraft.domain.product;

import com.unikraft.domain.product.category.Category;
import com.unikraft.domain.user.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pd_id")
    private Integer pdId;

    @Column(name = "pd_name")
    private String pdName;

    @Column(name = "pd_price")
    private Integer pdPrice;

    @Column(name = "pd_cnt")
    private Integer pdCnt;

    @Column(name = "status")
    private Integer status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "keyword")
    private String keyword;

    @Lob
    @Column(name = "contents", columnDefinition = "LONGTEXT")
    private String contents;

    @Column(name = "img_url")
    private String imgUrl;

    @Column(name = "like_cnt")
    private Integer likeCnt;

    @Column(name = "sale_cnt")
    private Integer saleCnt;

    @Column(name = "reg_date")
    private LocalDateTime regDate;
}