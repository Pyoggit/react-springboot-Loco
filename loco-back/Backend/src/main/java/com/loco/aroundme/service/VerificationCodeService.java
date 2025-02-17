package com.loco.aroundme.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class VerificationCodeService {
    private final Map<String, String> verificationCodes = new HashMap<>();

    // 인증번호 생성 및 저장
    public String generateCode(String email) {
        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        verificationCodes.put(email, code);
        return code;
    }

    // 인증번호 검증
    public boolean isValidCode(String email, String code) {
        return verificationCodes.containsKey(email) && verificationCodes.get(email).equals(code);
    }

    // 인증번호 삭제 (보안 강화)
    public void removeCode(String email) {
        verificationCodes.remove(email);
    }
}
