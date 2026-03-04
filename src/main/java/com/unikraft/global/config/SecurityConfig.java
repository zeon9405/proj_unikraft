package com.unikraft.global.config;

import com.unikraft.global.security.oauth2.CustomOAuth2UserService;
import com.unikraft.global.security.oauth2.OAuth2SuccessHandler;
import com.unikraft.global.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CSRF 비활성화 (REST API + JWT 방식)
            .csrf(AbstractHttpConfigurer::disable)
            // CORS 설정 (WebConfig 대신 Security에서 통합 관리)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 관리자 경로는 ADMIN 권한 필요, 나머지는 허용
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/order/admin/**").hasRole("ADMIN")
                .anyRequest().permitAll()
            )
            // OAuth2 소셜 로그인 설정
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
                .successHandler(oAuth2SuccessHandler)
                // 실패 시 /login?error 대신 프론트엔드로 리다이렉트하여 오류 확인 가능
                .failureHandler((request, response, exception) -> {
                    String msg = URLEncoder.encode(
                            exception.getMessage() != null ? exception.getMessage() : "소셜 로그인 실패",
                            StandardCharsets.UTF_8
                    );
                    response.sendRedirect(frontendUrl + "/oauth2/callback?error=" + msg);
                })
            )
            // JWT 필터를 Spring Security 인증 필터 앞에 배치
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(frontendUrl));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
