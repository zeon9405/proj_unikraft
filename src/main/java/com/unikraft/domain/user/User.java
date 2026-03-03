package com.unikraft.domain.user;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "name", length = 45)
    private String name;

    @Column(name = "login_id", length = 45)
    private String loginId;

    @Column(name = "pw", length = 255)
    private String pw;

    @Column(name = "role")
    private Integer role;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "tel", length = 45)
    private String tel;

    @Column(name = "major", length = 255)
    private String major;

    @Column(name = "contents", length = 255)
    private String contents;

    @Column(name = "img_url", length = 255)
    private String imgUrl;

    @Column(name = "brand", length = 255)
    private String brand;

    // 소셜 로그인용 (null이면 일반 로그인 회원)
    @Column(name = "provider", length = 50)
    private String provider;

    @Column(name = "provider_id", length = 255)
    private String providerId;
}
