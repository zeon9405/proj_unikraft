package com.unikraft.global.security.oauth2;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * OAuth2 로그인 성공 후 JWT를 URL에 직접 노출하지 않기 위해
 * 단기 임시 코드(UUID)를 발급하고 서버 메모리에 토큰 정보를 보관한다.
 *
 * - TTL: 5분
 * - 1회용: get() 호출 시 즉시 삭제
 */
@Component
public class TempCodeStore {

    private static final long TTL_SECONDS = 300;

    public record TokenInfo(String token, Integer userId, String name, Integer role) {}

    private record Entry(TokenInfo tokenInfo, Instant expiresAt) {}

    private final Map<String, Entry> store = new ConcurrentHashMap<>();

    /** 토큰 정보를 저장하고 1회용 코드를 반환한다. */
    public String save(String token, Integer userId, String name, Integer role) {
        String code = UUID.randomUUID().toString();
        store.put(code, new Entry(
                new TokenInfo(token, userId, name, role),
                Instant.now().plusSeconds(TTL_SECONDS)
        ));
        return code;
    }

    /**
     * 코드로 토큰 정보를 조회한다.
     * 만료되었거나 존재하지 않으면 null 반환.
     * 성공 시 코드는 즉시 삭제된다(1회용).
     */
    public TokenInfo get(String code) {
        Entry entry = store.remove(code);
        if (entry == null) return null;
        if (Instant.now().isAfter(entry.expiresAt())) return null;
        return entry.tokenInfo();
    }
}
