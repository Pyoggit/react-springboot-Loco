package com.loco.aroundme.common.security.jwt;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

//Spring Security에서 JWT 인증을 처리할 커스텀 Authentication 객체!
public class JwtAuthentication extends AbstractAuthenticationToken {

    private final String username; // JWT에서 가져온 사용자 이메일

    public JwtAuthentication(String username, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        this.username = username;
        setAuthenticated(true); // 인증된 상태로 설정
    }

    @Override
    public Object getCredentials() {
        return null; // JWT는 비밀번호 정보를 포함하지 않음
    }

    @Override
    public Object getPrincipal() {
        return username; // JWT에서 추출한 사용자 이메일을 Principal로 반환
    }
}
