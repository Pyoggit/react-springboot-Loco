package com.loco.aroundme.common.security.jwt;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;

@Component
public class JwtUtil {

    @Value("${jwt.secret}") // `application.properties`에서 가져오기!
    private String secretKey;

    private final long TOKEN_VALIDITY = 1000 * 60 * 60 * 24; // 24시간

    //JWT 토큰 생성
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + TOKEN_VALIDITY))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Secret Key 적용
                .compact();
    }

    //JWT 토큰 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Secret Key 적용
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    //JWT에서 사용자 정보 가져오기
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // Secret Key 적용
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    //Secret Key 반환 (보안 강화)
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    //Secret Key Getter (필터에서 사용)
    public String getSecretKey() {
        return secretKey;
    }
}
