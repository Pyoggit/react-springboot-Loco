package com.loco.aroundme.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;
import com.loco.aroundme.service.UsersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users") // 모든 유저 관련 API는 /api/users 경로로 통합
@RequiredArgsConstructor
public class UsersController {

    private final UsersService usersService;
    private final UsersMapper usersMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    /**
     * 회원가입 API (경로: /api/users/signup)
     */
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestPart("user") Users user, // JSON을 바로 Users 객체로 받음
                                               @RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
        try {
            System.out.println("회원가입 요청 데이터: " + user);
            usersService.registerUser(user, profileImage);
            return ResponseEntity.ok("회원가입이 완료되었습니다!");
        } catch (Exception e) {
            System.err.println("회원가입 실패: " + e.getMessage());
            return ResponseEntity.badRequest().body("회원가입 실패: " + e.getMessage());
        }
    }

    /**
     * 이메일 중복 체크 API (경로: /api/users/check-email)
     */
    @GetMapping("/check-email")
    public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
        Users existingUser = usersService.findByEmail(email);
        return ResponseEntity.ok(existingUser == null);
    }

    /**
     * 일반 사용자 로그인 API (경로: /api/users/login)
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        System.out.println("일반 유저 로그인 요청");
        System.out.println("요청 데이터: " + loginRequest);

        String userEmail = loginRequest.get("email");
        String password = loginRequest.get("password");

        Users user = usersMapper.read(userEmail);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("로그인 실패 - 잘못된 이메일 또는 비밀번호");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        Long roleId = user.getRoleId();
        String role = (roleId == 1) ? "ROLE_ADMIN" : "ROLE_USER";
        System.out.println("roleId: " + roleId + ", 변환된 role: " + role);

        // 일반 유저만 로그인 가능 (ROLE_ADMIN 차단)
        if (!role.equals("ROLE_USER")) {
            System.out.println("일반 유저 권한이 아님! roleId: " + roleId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
        }

        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        System.out.println("Access Token 발급: " + accessToken);
        System.out.println("Refresh Token 발급: " + refreshToken);

        // `Authorization` 헤더 추가!
        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + accessToken)  // 액세스 토큰을 헤더에 추가
                .header("Refresh-Token", refreshToken) // 리프레시 토큰도 헤더에 추가
                .body(Map.of("accessToken", accessToken, "refreshToken", refreshToken)); // 프론트에서 사용할 수 있도록 바디에도 추가
    }

}
