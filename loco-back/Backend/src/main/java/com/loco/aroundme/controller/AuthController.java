package com.loco.aroundme.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;

/**
 * 인증 컨트롤러 (로그인 API)
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsersMapper usersMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UsersMapper usersMapper, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.usersMapper = usersMapper;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 로그인 API
     */
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Users users = usersMapper.read(email);

        // 유저 존재 여부 및 비밀번호 검증
        if (users == null || !passwordEncoder.matches(password, users.getPassword())) {
            System.out.println("로그인 실패 - 잘못된 이메일 또는 비밀번호");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        // JWT 토큰 생성 (Users 객체를 직접 전달)
        String accessToken = jwtUtil.generateAccessToken(users);
        String refreshToken = jwtUtil.generateRefreshToken(users);

        System.out.println("Access Token 발급: " + accessToken);
        System.out.println("Refresh Token 발급: " + refreshToken);

        return ResponseEntity.ok()
                .header("Refresh-Token", refreshToken)
                .body(Map.of("accessToken", accessToken));
    }
}
