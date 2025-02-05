package com.loco.aroundme.common.security.domain;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import com.loco.aroundme.domain.Users;

public class CustomUser extends User {
    private static final long serialVersionUID = 1L;
    private Users users;

    public CustomUser(String username, String password, Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);
    }

    public CustomUser(Users users) {
        // roleList 제거 → 기본 역할 "ROLE_USER"만 설정
        super(users.getUserEmail(), users.getPassword(), List.of(new SimpleGrantedAuthority("ROLE_USER")));
        this.users = users;
    }

    public Users getUsers() {
        return users;
    }
}
