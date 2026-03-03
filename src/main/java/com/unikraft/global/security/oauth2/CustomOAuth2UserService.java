package com.unikraft.global.security.oauth2;

import com.unikraft.domain.user.User;
import com.unikraft.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * 구글·카카오 OAuth2 로그인 처리 서비스
 * - 사용자 정보를 DB에 저장/업데이트
 * - OAuth2User에 userId/role/name 추가하여 SuccessHandler로 전달
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OAuth2User oAuth2User = super.loadUser(userRequest);

            String registrationId = userRequest.getClientRegistration().getRegistrationId();
            Map<String, Object> attributes = oAuth2User.getAttributes();

            OAuthAttributes oAuthAttributes = OAuthAttributes.of(registrationId, attributes);
            User user = saveOrUpdate(oAuthAttributes);

            // SuccessHandler에서 JWT 발급에 필요한 정보를 attributes에 포함
            Map<String, Object> enriched = new HashMap<>(attributes);
            enriched.put("userId", user.getUserId());
            enriched.put("role", user.getRole());
            enriched.put("name", user.getName());

            // nameAttributeKey: 구글=sub, 카카오=id
            String nameAttributeKey = "kakao".equals(registrationId) ? "id" : "sub";

            return new DefaultOAuth2User(
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_USER")),
                    enriched,
                    nameAttributeKey
            );
        } catch (OAuth2AuthenticationException e) {
            throw e;
        } catch (Exception e) {
            // DB 오류, NPE 등 모든 예외를 Spring Security가 처리할 수 있는 형태로 변환
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("user_processing_error", e.getMessage(), null)
            );
        }
    }

    private User saveOrUpdate(OAuthAttributes attrs) {
        User user = userRepository
                .findByProviderAndProviderId(attrs.getProvider(), attrs.getProviderId())
                .orElse(attrs.toEntity());

        // 이름·이메일·프로필 이미지는 최신 정보로 업데이트
        user.setName(attrs.getName());
        if (attrs.getEmail() != null) user.setEmail(attrs.getEmail());
        if (attrs.getImgUrl() != null) user.setImgUrl(attrs.getImgUrl());

        return userRepository.save(user);
    }
}
