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
 * 관리자 인증 컨트롤러
 */
@RestController
@RequestMapping("/api/adminpage")
public class AdminAuthController {

    private final UsersMapper usersMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AdminAuthController(UsersMapper usersMapper, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.usersMapper = usersMapper;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        System.out.println("어드민 로그인 요청");

        String userEmail = loginRequest.get("email");
        String password = loginRequest.get("password");

        Users user = usersMapper.read(userEmail);
        
        // 유저 존재 여부 및 비밀번호 검증
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("로그인 실패 - 잘못된 이메일 또는 비밀번호");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        Long roleId = user.getRoleId();
        String role = (roleId == 1) ? "ROLE_ADMIN" : "ROLE_USER";
        System.out.println("roleId: " + roleId + ", 변환된 role: " + role);

        // 관리자만 로그인 가능 (roleId가 1이 아닐 경우 차단)
        if (!role.equals("ROLE_ADMIN")) {
            System.out.println("관리자 권한이 아님! roleId: " + roleId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
        }

        // JWT 토큰 생성 (Users 객체를 직접 전달)
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        System.out.println("Access Token 발급: " + accessToken);
        System.out.println("Refresh Token 발급: " + refreshToken);

        return ResponseEntity.ok()
                .header("Refresh-Token", refreshToken)
                .body(Map.of("accessToken", accessToken));
    }
}
