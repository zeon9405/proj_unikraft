package com.unikraft.global.security.oauth2;

import com.unikraft.domain.user.User;
import lombok.Builder;
import lombok.Getter;

import java.util.Map;

/**
 * 구글·카카오 OAuth2 응답을 공통 형식으로 정규화하는 DTO
 */
@Getter
@Builder
public class OAuthAttributes {

    private String provider;
    private String providerId;
    private String name;
    private String email;
    private String imgUrl;

    public static OAuthAttributes of(String registrationId, Map<String, Object> attributes) {
        if ("kakao".equals(registrationId)) {
            return ofKakao(attributes);
        }
        return ofGoogle(attributes);
    }

    private static OAuthAttributes ofGoogle(Map<String, Object> attributes) {
        return OAuthAttributes.builder()
                .provider("google")
                .providerId(String.valueOf(attributes.get("sub")))
                .name(String.valueOf(attributes.get("name")))
                .email(String.valueOf(attributes.get("email")))
                .imgUrl(String.valueOf(attributes.get("picture")))
                .build();
    }

    @SuppressWarnings("unchecked")
    private static OAuthAttributes ofKakao(Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        if (kakaoAccount == null) kakaoAccount = Map.of();
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
        if (profile == null) profile = Map.of();

        String email = kakaoAccount.containsKey("email")
                ? String.valueOf(kakaoAccount.get("email")) : null;
        String imgUrl = profile.containsKey("profile_image_url")
                ? String.valueOf(profile.get("profile_image_url")) : null;

        return OAuthAttributes.builder()
                .provider("kakao")
                .providerId(String.valueOf(attributes.get("id")))
                .name(String.valueOf(profile.get("nickname")))
                .email(email)
                .imgUrl(imgUrl)
                .build();
    }

    /** 신규 소셜 회원 엔티티 생성 */
    public User toEntity() {
        return User.builder()
                .provider(provider)
                .providerId(providerId)
                .name(name)
                .email(email)
                .imgUrl(imgUrl)
                .role(0) // 기본 일반회원
                .build();
    }
}
