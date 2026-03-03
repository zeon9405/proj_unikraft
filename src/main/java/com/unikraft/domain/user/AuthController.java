package com.unikraft.domain.user;

import com.unikraft.global.security.oauth2.TempCodeStore;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * OAuth2 소셜 로그인 후 임시 코드를 실제 JWT로 교환하는 엔드포인트
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final TempCodeStore tempCodeStore;

    /**
     * OAuth2 콜백에서 전달받은 단기 코드를 JWT 토큰으로 교환한다.
     *
     * GET /api/auth/token?code={tempCode}
     * 응답: { token, userId, name, role }
     */
    @GetMapping("/token")
    public ResponseEntity<?> exchangeToken(@RequestParam String code) {
        TempCodeStore.TokenInfo info = tempCodeStore.get(code);
        if (info == null) {
            return ResponseEntity.badRequest().body("유효하지 않거나 만료된 코드입니다.");
        }
        return ResponseEntity.ok(Map.of(
                "token",  info.token(),
                "userId", info.userId(),
                "name",   info.name(),
                "role",   info.role()
        ));
    }
}
