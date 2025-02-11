package com.loco.aroundme.common.security.jwt;

import java.io.IOException;
import java.util.Collections;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.loco.aroundme.domain.Users;

/**
 * JWT 인증 필터 (Spring Security 연동)
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String requestURI = request.getRequestURI();

        // 로그인 API 요청은 JWT 검사를 건너뜀
        if (requestURI.equals("/api/adminpage/login")) {
            chain.doFilter(request, response);
            return;
        }

        String accessToken = resolveToken(request);
        String refreshToken = resolveRefreshToken(request);

        // 액세스 토큰이 유효하면 사용자 인증 처리
        if (accessToken != null && jwtUtil.validateToken(accessToken)) {
            authenticateUser(accessToken);
        }
        // 액세스 토큰이 만료되었지만 리프레시 토큰이 유효하면 새로운 액세스 토큰 발급
        else if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
            refreshAccessToken(refreshToken, response);
        }

        chain.doFilter(request, response);
    }

    /**
     * 새 액세스 토큰을 발급하고 사용자 인증을 수행
     */
    private void refreshAccessToken(String refreshToken, HttpServletResponse response) {
        Claims claims = jwtUtil.getClaims(refreshToken);
        Long userId = Long.valueOf(claims.getSubject());
        String userEmail = claims.get("email", String.class);
        String role = claims.get("role", String.class);
        Long roleId = role.equals("ROLE_ADMIN") ? 1L : 2L;

        // Users 객체 생성 후 AccessToken 발급
        Users user = Users.builder()
                .userId(userId)
                .userEmail(userEmail)
                .roleId(roleId)
                .build();

        String newAccessToken = jwtUtil.generateAccessToken(user);
        response.setHeader("Authorization", "Bearer " + newAccessToken);

        authenticateUser(newAccessToken);
    }

    /**
     * 사용자 인증 처리
     */
    private void authenticateUser(String token) {
        Claims claims = jwtUtil.getClaims(token);
        String userEmail = claims.get("email", String.class);
        String role = claims.get("role", String.class);

        UserDetails userDetails = new User(userEmail, "", Collections.singletonList(new SimpleGrantedAuthority(role)));
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    /**
     * HTTP 요청에서 액세스 토큰 추출
     */
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        return (bearerToken != null && bearerToken.startsWith("Bearer ")) ? bearerToken.substring(7) : null;
    }

    /**
     * HTTP 요청에서 리프레시 토큰 추출
     */
    private String resolveRefreshToken(HttpServletRequest request) {
        String refreshToken = request.getHeader("Refresh-Token");
        return (refreshToken != null && !refreshToken.isEmpty()) ? refreshToken : null;
    }
//    private String resolveRefreshToken(HttpServletRequest request) {
//        if (request.getCookies() != null) {
//            for (Cookie cookie : request.getCookies()) {
//                if ("refreshToken".equals(cookie.getName())) {
//                    return cookie.getValue();
//                }
//            }
//        }
//        return null;
//    }

}
