package com.unikraft.global.security.oauth2;

import com.unikraft.global.security.jwt.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * OAuth2 로그인 성공 시 JWT를 발급하고
 * 프론트엔드 콜백 페이지로 리다이렉트
 *
 * 보안: 토큰을 URL에 직접 포함하지 않고 단기 임시 코드만 전달한다.
 * 프론트엔드는 코드로 /api/auth/token 을 호출하여 실제 토큰을 교환한다.
 */
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final TempCodeStore tempCodeStore;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        Integer userId = (Integer) oAuth2User.getAttributes().get("userId");
        Integer role   = (Integer) oAuth2User.getAttributes().get("role");
        String  name   = (String)  oAuth2User.getAttributes().get("name");

        String token = jwtTokenProvider.createToken(userId, role);
        String code  = tempCodeStore.save(token, userId, name != null ? name : "", role);

        getRedirectStrategy().sendRedirect(request, response, frontendUrl + "/oauth2/callback?code=" + code);
    }
}
