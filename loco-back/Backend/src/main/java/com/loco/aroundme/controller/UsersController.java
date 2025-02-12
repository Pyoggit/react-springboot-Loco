package com.loco.aroundme.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
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

import jakarta.servlet.http.HttpServletResponse;
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
     * JSON 데이터는 Users 객체로, 프로필 사진은 MultipartFile로 수신
     */
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(
            @RequestPart("user") Users user,
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
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {
        System.out.println("일반 유저 로그인 요청");
        System.out.println("요청 데이터: " + loginRequest);

        String userEmail = loginRequest.get("email");
        String password = loginRequest.get("password");

        Users user = usersMapper.read(userEmail);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("로그인 실패 - 잘못된 이메일 또는 비밀번호");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        Long roleId = user.getRoleId();
        String role = (roleId == 1) ? "ROLE_ADMIN" : "ROLE_USER";
        System.out.println("roleId: " + roleId + ", 변환된 role: " + role);

        if (!role.equals("ROLE_USER")) {
            System.out.println("일반 유저 권한이 아님! roleId: " + roleId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Access denied"));
        }

        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        System.out.println("normal_Access Token 발급: " + accessToken);
        System.out.println("normal_Refresh Token 발급: " + refreshToken);

        // 토큰들을 Map에 매핑
        Map<String, String> tokens = new HashMap<>();
        tokens.put("normal_accessToken", accessToken);
        tokens.put("normal_refreshToken", refreshToken);

        // ResponseCookie를 이용해 refreshToken을 쿠키로 생성
        // - 개발 환경(HTTP)에서는 secure=false로, 쿠키 도메인을 "localhost"로 명시하여
        //   http://localhost:5173에서도 쿠키를 확인할 수 있도록 합니다.
        // - SameSite 옵션을 "Lax"로 설정하면 일반적인 내비게이션에서는 쿠키가 유지됩니다.
        ResponseCookie refreshTokenCookie = ResponseCookie.from("normal_refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)              // 개발 환경: HTTP
                .domain("localhost")        // 쿠키 도메인을 localhost로 지정
                .path("/")
                .maxAge(604800)             // 7일 (초 단위)
                .sameSite("Lax")            // SameSite Lax 옵션
                .build();

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + accessToken)
                .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
                .body(Map.of(
                        "tokens", tokens,
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
        jwtUtil.addToBlacklist(token); // JWT를 블랙리스트에 추가
        return ResponseEntity.ok("로그아웃 성공!");
    }

    /**
     * 로그인한 사용자 정보 가져오기 (경로: /api/users/me)
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader(value = "Authorization", required = false) String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Missing or invalid token format"));
        }
        // "Bearer " 제거 후 순수 토큰만 추출
        token = token.substring(7);
        System.out.println("🔍 받은 JWT 토큰: " + token);

        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token"));
        }

        String userEmail = jwtUtil.getUserEmail(token);
        System.out.println("📌 토큰에서 추출한 이메일: " + userEmail);

        Users user = usersMapper.read(userEmail);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        return ResponseEntity.ok(Map.of(
                "userId", user.getUserId(),
                "email", user.getUserEmail(),
                "userName", user.getUserName(),
                "role", user.getRoleId() == 1 ? "ROLE_ADMIN" : "ROLE_USER"
        ));
    }
}
