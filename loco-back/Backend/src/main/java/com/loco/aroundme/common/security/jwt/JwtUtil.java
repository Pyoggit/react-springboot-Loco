package com.loco.aroundme.common.security.jwt;

import java.util.Date;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.loco.aroundme.domain.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

/**
 * ✅ JWT 생성 및 검증을 위한 유틸 클래스
 */
@Slf4j
@Component
public class JwtUtil {

	@Value("${jwt.secret}") // 🔹 application.properties에서 불러오는 JWT 비밀 키
	private String secretKey;

	private final long ACCESS_TOKEN_EXPIRATION = 1000 * 60 * 60; // 🔹 1시간 (60분)
	private final long REFRESH_TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 7; // 🔹 7일 (일주일)

	// 🔹 로그아웃된 토큰(블랙리스트) 관리
	private final Set<String> tokenBlacklist = ConcurrentHashMap.newKeySet();

	/** ✅ 일반 사용자(Users)용 액세스 토큰 생성 */
	public String generateAccessToken(Users user) {
		String role = (user.getRoleId() == 1) ? "ROLE_ADMIN" : "ROLE_USER"; // 역할 설정

		return Jwts.builder().setSubject(String.valueOf(user.getUserId())) // userId를 Subject에 저장
				.claim("email", user.getUserEmail()) // 이메일 저장
				.claim("role", role) // 역할 정보 저장
				.setIssuedAt(new Date()) // 발급 시간
				.setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION)) // 만료 시간
				.signWith(getSigningKey(), SignatureAlgorithm.HS256) // 서명 설정
				.compact().trim();
	}

//    /** ✅ 카카오 사용자(KakaoUsers)용 액세스 토큰 생성 */
//    public String generateAccessToken(KakaoUsers user) {
//        String role = "ROLE_USER"; // 카카오 로그인 사용자는 기본적으로 일반 유저
//
//        return Jwts.builder()
//                .setSubject(user.getKakaoId()) // ✅ 카카오 ID 저장
//                .claim("email", user.getUserEmail()) // 이메일 저장
//                .claim("name", user.getUserName()) // 이름 저장
//                .claim("profile", user.getSysFile()) // 프로필 이미지 저장
//                .claim("role", role) // 역할 정보 저장
//                .setIssuedAt(new Date()) // 발급 시간
//                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION)) // 만료 시간
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 서명 설정
//                .compact();
//    }
//
//    /** ✅ 구글 사용자(GoogleUsers)용 액세스 토큰 생성 */
//    public String generateAccessToken(GoogleUsers user) {
//        String role = "ROLE_USER"; // Google 로그인 사용자는 기본적으로 일반 유저
//
//        return Jwts.builder()
//                .setSubject(user.getGoogleId()) // ✅ Google ID 저장
//                .claim("email", user.getUserEmail()) // 이메일 저장
//                .claim("name", user.getUserName()) // 이름 저장
//                .claim("profile", user.getSysFile()) // 프로필 이미지 저장
//                .claim("role", role) // 역할 정보 저장
//                .setIssuedAt(new Date()) // 발급 시간
//                .setExpiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXPIRATION)) // 만료 시간
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 서명 설정
//                .compact();
//    }

	/** ✅ 일반 사용자(Users)용 리프레시 토큰 생성 */
	public String generateRefreshToken(Users user) {
		return Jwts.builder().setSubject(String.valueOf(user.getUserId())) // userId 저장
				.setIssuedAt(new Date()) // 발급 시간
				.setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION)) // 만료 시간
				.signWith(getSigningKey(), SignatureAlgorithm.HS256) // 서명 설정
				.compact().trim();
	}

//    /** ✅ 카카오 사용자(KakaoUsers)용 리프레시 토큰 생성 */
//    public String generateRefreshToken(KakaoUsers user) {
//        return Jwts.builder()
//                .setSubject(user.getKakaoId()) // ✅ 카카오 ID 저장
//                .setIssuedAt(new Date()) // 발급 시간
//                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION)) // 만료 시간
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 서명 설정
//                .compact();
//    }
//
//    /** ✅ 구글 사용자(GoogleUsers)용 리프레시 토큰 생성 */
//    public String generateRefreshToken(GoogleUsers user) {
//        return Jwts.builder()
//                .setSubject(user.getGoogleId()) // ✅ Google ID 저장
//                .setIssuedAt(new Date()) // 발급 시간
//                .setExpiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXPIRATION)) // 만료 시간
//                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // 서명 설정
//                .compact();
//    }

	/** ✅ JWT 검증 (블랙리스트 체크 포함) */
	public boolean validateToken(String token) {
		if (token == null || token.isEmpty() || "undefined".equals(token)) {
			log.error("🚨 validateToken()에서 받은 토큰이 잘못됨: {}", token);
			return false;
		}

		try {
			if (tokenBlacklist.contains(token)) {
				log.warn("🚨 블랙리스트 토큰 감지: {}", token);
				return false;
			}
			Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
			return true;
		} catch (ExpiredJwtException e) {
			log.warn("⏳ JWT 만료됨: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			log.warn("❌ 지원되지 않는 JWT 형식: {}", e.getMessage());
		} catch (MalformedJwtException e) {
			log.warn("⚠️ JWT가 손상됨: {}", e.getMessage());
			log.warn("📌 문제 발생한 토큰: {}", token);
		} catch (SignatureException e) {
			log.warn("🔑 서명 검증 실패: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			log.warn("🚨 JWT 처리 오류: {}", e.getMessage());
		}
		return false;
	}

	/** ✅ 토큰이 블랙리스트에 있는지 확인 */
	public boolean isBlacklisted(String token) {
		return tokenBlacklist.contains(token);
	}

	/** ✅ JWT 토큰에서 이메일 추출 */
	public String getEmailFromToken(String token) {
		try {
			Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
			return claims.get("email", String.class);
		} catch (Exception e) {
			log.warn("🚨 JWT에서 이메일 추출 실패: {}", e.getMessage());
			return null;
		}
	}

	/** ✅ 토큰 블랙리스트 추가 (로그아웃 시 사용) */
	public void addToBlacklist(String token) {
		tokenBlacklist.add(token);
		log.info("🔴 블랙리스트 추가: {}", token);
	}

	/** ✅ 토큰에서 Claims 정보 가져오기 */
	public Claims getClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
	}

	/** ✅ 토큰에서 사용자 ID 가져오기 */
	public String getUserId(String token) {
		return getClaims(token).getSubject();
	}

	/** ✅ 토큰에서 사용자 이메일 가져오기 */
	public String getUserEmail(String token) {
		try {
			Claims claims = Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
			return claims.get("email", String.class);
		} catch (ExpiredJwtException e) {
			log.warn("⏳ JWT 만료됨: {}", e.getMessage());
		} catch (UnsupportedJwtException e) {
			log.warn("❌ 지원되지 않는 JWT 형식: {}", e.getMessage());
		} catch (MalformedJwtException e) {
			log.warn("⚠️ JWT가 손상됨: {}", e.getMessage());
			log.warn("📌 문제가 발생한 토큰: {}", token); // 🚨 문제 발생 시 토큰 출력
		} catch (SignatureException e) {
			log.warn("🔑 서명 검증 실패: {}", e.getMessage());
		} catch (IllegalArgumentException e) {
			log.warn("🚨 JWT 처리 오류: {}", e.getMessage());
		}
		return null; // 오류 발생 시 null 반환
	}

	/** ✅ 토큰에서 사용자 이름 가져오기 */
	public String getUserName(String token) {
		return getClaims(token).get("name", String.class);
	}

	/** ✅ 토큰에서 사용자 프로필 이미지 가져오기 */
	public String getUserProfile(String token) {
		return getClaims(token).get("profileImage", String.class);
	}

	/** ✅ 토큰에서 역할(Role) 가져오기 */
	public String getUserRole(String token) {
		return getClaims(token).get("role", String.class);
	}

	/** ✅ Secret Key 반환 (보안 강화) */
	private SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secretKey.getBytes());
	}

	/** ✅ 쿠키 문자열에서 특정 쿠키 값 추출 */
	public String extractTokenFromCookies(String cookies, String tokenName) {
		if (cookies == null || cookies.isEmpty()) {
			log.warn("🚨 쿠키가 비어 있음. ({}을 찾을 수 없음)", tokenName);
			return null;
		}

		// 쿠키 문자열을 세미콜론(;)으로 분리
		String[] cookiePairs = cookies.split("; ");
		for (String cookie : cookiePairs) {
			String[] keyValue = cookie.split("=", 2);
			if (keyValue.length == 2 && keyValue[0].equals(tokenName)) {
				log.info("✅ 쿠키에서 {} 찾음: {}", tokenName, keyValue[1]);
				return keyValue[1];
			}
		}

		log.warn("🚨 {} 쿠키를 찾을 수 없음", tokenName);
		return null;
	}
	
	/** ✅ 토큰에서 사용자 ID 추출 (기존 getUserId와 동일한 기능) 나종호가 건드림 테스트해보려고함 */
    public Integer getUserIdFromToken(String token) {
    	try {
            System.out.println("🔍 [DEBUG] Token received: " + token); // ✅ 토큰 로그 출력
            Claims claims = Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token.replace("Bearer ", "")) // ✅ "Bearer " 제거 후 파싱
                .getBody();
            int userId = (int) claims.get("userId");
            System.out.println("✅ [SUCCESS] Extracted userId: " + userId); // ✅ 추출된 userId 확인
            return userId;
        } catch (Exception e) {
            System.err.println("❌ [ERROR] Invalid token: " + e.getMessage()); // ❌ 에러 로그 출력
            throw new RuntimeException("Invalid token", e);
        }
    }
}
