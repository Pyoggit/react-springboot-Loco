package com.loco.aroundme.controller;

import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.GoogleUsers;
import com.loco.aroundme.service.GoogleUsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth/google")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173") // React 요청 허용
public class GoogleAuthController {

//    private final GoogleUsersService googleUsersService;
//    private final RestTemplate restTemplate = new RestTemplate();
//    private final JwtUtil jwtUtil;
//
//    private static final String GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=";
//
//    @PostMapping("/callback")
//    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> requestBody) {
//        String token = requestBody.get("token");
//        log.info("Google 로그인 요청 토큰: {}", token);
//
//        GoogleUsers googleUser = getGoogleUserInfo(token);
//        if (googleUser == null) {
//            log.error("Google 사용자 정보 요청 실패");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google 로그인 실패");
//        }
//        log.info("Google 사용자 정보: {}", googleUser);
//
//        // 1. DB에 사용자 저장 (이미 존재하면 업데이트 X)
//        GoogleUsers existingUser = googleUsersService.findByGoogleId(googleUser.getGoogleId());
//        if (existingUser == null) {
//            googleUsersService.registerGoogleUser(googleUser);
//            log.info("새로운 Google 사용자 등록 완료");
//        } else {
//            log.info("기존 Google 사용자 로그인 성공");
//        }
//
//        // 2. JWT 발급
//        String accessToken = jwtUtil.generateAccessToken(googleUser);
//        String refreshToken = jwtUtil.generateRefreshToken(googleUser);
//        log.info("JWT AccessToken 발급: {}", accessToken);
//        log.info("JWT RefreshToken 발급: {}", refreshToken);
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
//                .header("Refresh-Token", refreshToken)
//                .body(Map.of("accessToken", accessToken, "refreshToken", refreshToken));
//    }
//
//    /**
//     * Google 사용자 정보 요청
//     */
//    private GoogleUsers getGoogleUserInfo(String token) {
//        ResponseEntity<JsonNode> response = restTemplate.getForEntity(GOOGLE_USER_INFO_URL + token, JsonNode.class);
//        JsonNode userInfo = response.getBody();
//        if (userInfo == null || userInfo.get("sub") == null) {
//            return null;
//        }
//
//        String googleId = userInfo.get("sub").asText();
//        String userEmail = userInfo.has("email") ? userInfo.get("email").asText() : null;
//        String userName = userInfo.has("name") ? userInfo.get("name").asText() : null;
//        String profileImage = userInfo.has("picture") ? userInfo.get("picture").asText() : null;
//
//        return new GoogleUsers(googleId, userEmail, userName, profileImage, profileImage, 2L, null);
//    }
}
