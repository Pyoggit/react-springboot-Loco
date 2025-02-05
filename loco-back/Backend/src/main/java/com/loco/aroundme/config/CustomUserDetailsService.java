package com.loco.aroundme.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.loco.aroundme.common.security.domain.CustomUser;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsersMapper mapper;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Load User By UserName : " + username);

        // 사용자 조회 (이메일 기준)
        Users users = mapper.read(username);
        log.info("User queried by UsersMapper: " + users);

        // 사용자 정보가 없을 경우 예외 발생
        if (users == null) {
            log.error("User not found: " + username);
            throw new UsernameNotFoundException("User not found: " + username);
        }

        return new CustomUser(users);
    }
}
