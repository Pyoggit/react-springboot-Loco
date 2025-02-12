package com.loco.aroundme.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
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

        if (!role.equals("ROLE_USER")) {
            System.out.println("일반 유저 권한이 아님! roleId: " + roleId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
        }

        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        System.out.println("Access Token 발급: " + accessToken);
        System.out.println("Refresh Token 발급: " + refreshToken);

        // ✅ `user` 객체를 응답에 포함
        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + accessToken)
                .header("Refresh-Token", refreshToken)
                .body(Map.of(
                    "accessToken", accessToken,
                    "refreshToken", refreshToken,
                    "user", Map.of(
                        "userId", user.getUserId(),
                        "email", user.getUserEmail(),
                        "userName", user.getUserName(),
                        "role", role
                    )
                ));
    }
    /**
     * 일반 사용자 로그아웃 API (경로: /api/users/logout)
     */
    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7); // "Bearer " 제거
        }

        jwtUtil.addToBlacklist(token); // 🔴 JWT를 블랙리스트에 추가
        return ResponseEntity.ok("로그아웃 성공!");
    }
    /**
     * 로그인한 사용자 정보 가져오기 (경로: /api/users/me)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Missing or invalid token format"));
        }

        // "Bearer " 제거 후 순수한 토큰만 추출
        token = token.substring(7);

        // 로그 추가 (디버깅용)
        System.out.println("🔍 받은 JWT 토큰: " + token);

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        }

        String userEmail = jwtUtil.getUserEmail(token);
        System.out.println("📌 토큰에서 추출한 이메일: " + userEmail);

        Users user = usersMapper.read(userEmail);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        return ResponseEntity.ok(Map.of(
            "userId", user.getUserId(),
            "email", user.getUserEmail(),
            "userName", user.getUserName(),
            "role", user.getRoleId() == 1 ? "ROLE_ADMIN" : "ROLE_USER"
        ));
    }


}
