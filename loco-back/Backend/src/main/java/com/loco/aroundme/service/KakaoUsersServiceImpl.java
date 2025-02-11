package com.loco.aroundme.service;

import java.util.Optional;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.loco.aroundme.domain.KakaoUsers;
import com.loco.aroundme.mapper.KakaoUsersMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class KakaoUsersServiceImpl implements KakaoUsersService {

    private final KakaoUsersMapper kakaoUsersMapper;

    @Override
    public Optional<KakaoUsers> findByKakaoId(String kakaoId) {
        log.info("findByKakaoId 호출: {}", kakaoId);
        return Optional.ofNullable(kakaoUsersMapper.findByKakaoId(kakaoId));
    }

    @Override
    @Transactional
    public void registerKakaoUser(KakaoUsers kakaoUsers) {
        log.info("registerKakaoUser 호출: {}", kakaoUsers);
        kakaoUsersMapper.insertKakaoUser(kakaoUsers);
    }
}
