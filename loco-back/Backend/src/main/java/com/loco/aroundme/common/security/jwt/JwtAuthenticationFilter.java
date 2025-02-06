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
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * JWT 인증 필터 (Spring Security 6.x 대응)
 */
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String accessToken = resolveToken(request);
        String refreshToken = resolveRefreshToken(request);

        // 액세스 토큰이 유효하면 그대로 인증 진행
        if (accessToken != null && jwtUtil.validateToken(accessToken)) {
            authenticateUser(accessToken);
        } 
        // 액세스 토큰이 만료되었지만 리프레시 토큰이 유효하면 새로운 액세스 토큰 발급
        else if (refreshToken != null && jwtUtil.validateToken(refreshToken)) {
            Claims claims = jwtUtil.getClaims(refreshToken);
            String username = claims.getSubject();

            // 새 액세스 토큰 발급
            String newAccessToken = jwtUtil.generateAccessToken(username);
            response.setHeader("Authorization", "Bearer " + newAccessToken); // 새 토큰 발급 후 응답 헤더에 추가

            authenticateUser(newAccessToken);
        }

        chain.doFilter(request, response);
    }

    // 사용자 인증 처리
    private void authenticateUser(String token) {
        Claims claims = jwtUtil.getClaims(token);
        String username = claims.getSubject();

        UserDetails userDetails = new User(username, "", Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    // HTTP 요청에서 액세스 토큰 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    // HTTP 요청에서 리프레시 토큰 추출
    private String resolveRefreshToken(HttpServletRequest request) {
        String refreshToken = request.getHeader("Refresh-Token");
        return (refreshToken != null && !refreshToken.isEmpty()) ? refreshToken : null;
    }
}
