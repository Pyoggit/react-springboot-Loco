package com.loco.aroundme.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VerificationCodeService {
    private final Map<String, VerificationInfo> verificationCodes = new ConcurrentHashMap<>();
    private static final long EXPIRATION_TIME = 5 * 60 * 1000; // ✅ 5분 (밀리초)

    // 인증번호 생성 및 저장 (중복 요청 시 기존 코드 유지)
    public String generateCode(String email) {
        long currentTime = System.currentTimeMillis();

        // ✅ 이미 존재하는 코드가 있으면 유지 (만료시간 확인)
        if (verificationCodes.containsKey(email)) {
            VerificationInfo info = verificationCodes.get(email);
            if (currentTime < info.expirationTime) {
                return info.code;
            }
        }

        // ✅ 새로운 코드 생성 및 저장
        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        verificationCodes.put(email, new VerificationInfo(code, currentTime + EXPIRATION_TIME));

        return code;
    }

    // 인증번호 검증 (검증 성공 시 즉시 삭제)
    public boolean isValidCode(String email, String code) {
        if (!verificationCodes.containsKey(email)) return false;

        VerificationInfo info = verificationCodes.get(email);
        if (System.currentTimeMillis() > info.expirationTime) {
            verificationCodes.remove(email);
            return false; // 만료됨
        }

        boolean isValid = info.code.equals(code);
        if (isValid) {
            verificationCodes.remove(email); // ✅ 인증 성공 시 즉시 삭제
        }

        return isValid;
    }

    // ✅ 일정 주기로 만료된 인증번호 자동 삭제 (1분마다 실행)
    @Scheduled(fixedRate = 60 * 1000)
    public void cleanupExpiredCodes() {
        long currentTime = System.currentTimeMillis();
        Iterator<Map.Entry<String, VerificationInfo>> iterator = verificationCodes.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry<String, VerificationInfo> entry = iterator.next();
            if (currentTime > entry.getValue().expirationTime) {
                iterator.remove(); // ✅ 만료된 코드 삭제
            }
        }
    }
    
    // 수동 삭제 (보안 강화)
    public void removeCode(String email) {
        verificationCodes.remove(email);
    }
    
    // 내부 클래스로 인증번호 정보 관리
    private static class VerificationInfo {
        String code;
        long expirationTime;

        VerificationInfo(String code, long expirationTime) {
            this.code = code;
            this.expirationTime = expirationTime;
        }
    }
    
  
}
