package com.loco.aroundme.common.security.jwt;

import java.util.Date;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT 생성 및 검증을 위한 유틸 클래스
 */
@Slf4j
@Component
public class JwtUtil {

	@Value("${jwt.secret}") // application.properties에서 가져오는 JWT 비밀 키
	private String secretKey;

	private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60; // 액세스 토큰 유효시간 (1시간)
	private final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24; // 리프레시 토큰 유효시간 (24시간)

	// 블랙리스트 (로그아웃된 토큰 저장)
	private final Set<String> tokenBlacklist = ConcurrentHashMap.newKeySet();

//	/**
//	 * 액세스 토큰 생성 (유저 역할 ID 포함)
//	 */
//	public String generateAccessToken(String username, Long roleId) {
//		String role = "ROLE_" + roleId; // "ROLE_1", "ROLE_2" 형식
//		return Jwts.builder().setSubject(username)
////                .claim("roleId", roleId) 
//				.claim("role", role) // "roleId" 대신 "role"을 저장
//				.setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
//				.signWith(getSigningKey(), SignatureAlgorithm.HS256).compact();
//	}
	/**
	 * 액세스 토큰 생성 (role을 "ROLE_1" 또는 "ROLE_2" 그대로 사용)
	 */
	public String generateAccessToken(String userEmail, Long roleId) {
        String role = (roleId == 1) ? "ROLE_ADMIN" : "ROLE_USER"; // roleId -> "ROLE_ADMIN" 또는 "ROLE_USER"
        System.out.println("토큰의 roleID" + roleId);
        
        return Jwts.builder()
                .setSubject(userEmail) // subject에 userEmail 저장
                .claim("role", role) // roleId 대신 roleName 저장
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

	/**
	 * 리프레시 토큰 생성
	 */
	 public String generateRefreshToken(String userEmail) {
	        return Jwts.builder()
	                .setSubject(userEmail)
	                .setIssuedAt(new Date())
	                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION))
	                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
	                .compact();
	    }

	/**
	 * JWT 검증 (블랙리스트 체크 포함)
	 */
	public boolean validateToken(String token) {
		try {
			if (tokenBlacklist.contains(token)) {
				log.warn("사용 불가능한 (블랙리스트) 토큰: {}", token);
				return false;
			}
			Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
			return true;
		} catch (ExpiredJwtException e) {
			log.warn("JWT 만료됨: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			log.warn("지원되지 않는 JWT 형식: {}", e.getMessage());
		} catch (MalformedJwtException e) {
			log.warn("JWT가 손상됨: {}", e.getMessage());
		} catch (SignatureException e) {
			log.warn("서명 검증 실패: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			log.warn("JWT 처리 오류: {}", e.getMessage());
		}
		return false;
	}

	// 토큰에서 Claims 정보 가져오기
	public Claims getClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

//	// JWT에서 역할 ID(roleId) 가져오기
//    public Long getUserRoleId(String token) {
//        String role = getUserRole(token); // "ROLE_1" 또는 "ROLE_2"
//        return Long.valueOf(role.replace("ROLE_", "")); // "ROLE_1" -> 1 변환
//    }

//	// 토큰 만료 여부 확인
//	public boolean isTokenExpired(String token) {
//		try {
//			return getClaims(token).getExpiration().before(new Date());
//		} catch (Exception e) {
//			return true;
//		}
//	}
//
//	// 토큰 블랙리스트에 추가 (로그아웃 시 사용)
//	public void addToBlacklist(String token) {
//		tokenBlacklist.add(token);
//		log.info("블랙리스트에 추가된 토큰: ", token);
//	}
//
//	// JWT에서 사용자 이름 가져오기
//	public String getUsername(String token) {
//		return getClaims(token).getSubject();
//	}
//
//	// JWT에서 유저 역할 가져오기
	 public String getUserRole(String token) {
	        return getClaims(token).get("role", String.class); // "ROLE_ADMIN" 또는 "ROLE_USER"
	    }


//	// JWT에서 토큰 유형 가져오기
//	public String getTokenType(String token) {
//		return getClaims(token).get("type", String.class);
//	}

	// Secret Key 반환 (보안 강화)
	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}

//	// Secret Key Getter (필터에서 사용)
//	public String getSecretKey() {
//		return secretKey;
//	}
}
