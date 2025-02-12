package com.loco.aroundme.controller;

import java.util.Optional;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.KakaoUsers;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.service.KakaoUsersService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth/kakao")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173") // React에서 요청 허용
public class KakaoAuthController {

    private final KakaoUsersService kakaoUsersService;
    private final JwtUtil jwtUtil;
    private final WebClient webClient = WebClient.create(); // WebClient 사용

    @Value("${kakao.client-id}") 
    private String clientId;

    @Value("${kakao.redirect-uri}") 
    private String redirectUri;

    private static final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";
    private static final String USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

    /**
     * 카카오 로그인 (JWT 발급)
     */
//    @PostMapping("/callback")
//    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> requestBody) {
//        String code = requestBody.get("code");
//        log.info("카카오 로그인 요청 코드: {}", code);
//
//        if (code == null || code.isEmpty()) {
//            log.error("code 값이 전달되지 않음!");
//            return ResponseEntity.badRequest().body("카카오 로그인 실패: code 값이 없음");
//        }
//
//        // 1. 카카오 서버에서 Access Token 가져오기
//        String kakaoAccessToken = getKakaoAccessToken(code);
//        if (kakaoAccessToken == null) {
//            log.error("카카오 액세스 토큰 요청 실패");
//            return ResponseEntity.badRequest().body("카카오 로그인 실패");
//        }
//        // 어차피 안가는 값 삭제
////        log.info("카카오 액세스 토큰: {}", kakaoAccessToken);
//
//        // 2. 카카오 사용자 정보 가져오기
//        KakaoUsers kakaoUser = getKakaoUserInfo(kakaoAccessToken);
//        if (kakaoUser == null) {
//            log.error("카카오 사용자 정보 요청 실패");
//            return ResponseEntity.badRequest().body("카카오 로그인 실패");
//        }
//        log.info("카카오 사용자 정보: {}", kakaoUser);
//
//        // 3. DB에 사용자 저장 (이미 존재하면 업데이트 X)
//        Optional<KakaoUsers> existingUser = kakaoUsersService.findByKakaoId(kakaoUser.getKakaoId());
//        if (existingUser.isEmpty()) {
//            kakaoUsersService.registerKakaoUser(kakaoUser);
//            log.info("새로운 카카오 사용자 등록 완료");
//        } else {
//            log.info("기존 카카오 사용자 로그인 성공");
//        }
//
//        // 4. JWT 발급
//        String accessToken = jwtUtil.generateAccessToken(kakaoUser);
//        String refreshToken = jwtUtil.generateRefreshToken(kakaoUser);
//
//        log.info("JWT AccessToken 발급: {}", accessToken);
//        log.info("JWT RefreshToken 발급: {}", refreshToken);
//
//        return ResponseEntity.ok()
//                .header("Authorization", "Bearer " + accessToken)  // 헤더에 추가
//                .header("Refresh-Token", refreshToken)
//                .body(Map.of("accessToken", accessToken, "refreshToken", refreshToken));
//    }
    
    //이거
//    @PostMapping("/callback")
//    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> requestBody) {
//        String code = requestBody.get("code");
//        log.info("카카오 로그인 요청 코드: {}", code);
//
//        if (code == null || code.isEmpty()) {
//            log.error("code 값이 전달되지 않음!");
//            return ResponseEntity.badRequest().body("카카오 로그인 실패: code 값이 없음");
//        }
//
//        // 1. 카카오 서버에서 Access Token 가져오기
//        String kakaoAccessToken = getKakaoAccessToken(code);
//        if (kakaoAccessToken == null) {
//            log.error("카카오 액세스 토큰 요청 실패");
//            return ResponseEntity.badRequest().body("카카오 로그인 실패");
//        }
//        // 어차피 안가는 값 삭제
////        log.info("카카오 액세스 토큰: {}", kakaoAccessToken);
//
//        // 2. 카카오 사용자 정보 가져오기
//        KakaoUsers kakaoUser = getKakaoUserInfo(kakaoAccessToken);
//        if (kakaoUser == null) {
//            log.error("카카오 사용자 정보 요청 실패");
//            return ResponseEntity.badRequest().body("카카오 로그인 실패");
//        }
//        log.info("카카오 사용자 정보: {}", kakaoUser);
//
//        // 3. DB에 사용자 저장 (이미 존재하면 업데이트 X)
//        Optional<KakaoUsers> existingUser = kakaoUsersService.findByKakaoId(kakaoUser.getKakaoId());
//        if (existingUser.isEmpty()) {
//            kakaoUsersService.registerKakaoUser(kakaoUser);
//            log.info("새로운 카카오 사용자 등록 완료");
//        } else {
//            log.info("기존 카카오 사용자 로그인 성공");
//        }
//
//        // 4. JWT 발급
//        String accessToken = jwtUtil.generateAccessToken(kakaoUser);
//        String refreshToken = jwtUtil.generateRefreshToken(kakaoUser);
//
//        log.info("JWT AccessToken 발급: {}", accessToken);
//        log.info("JWT RefreshToken 발급: {}", refreshToken);
//
//        return ResponseEntity.ok()
//                .header("Authorization", "Bearer " + accessToken)  // 헤더에 추가
//                .header("Refresh-Token", refreshToken)
//                .body(Map.of("accessToken", accessToken, "refreshToken", refreshToken));
//    }

    /**
     * 카카오 Access Token 요청 (WebClient 사용)
     */
//    private String getKakaoAccessToken(String code) {
//        return webClient.post()
//                .uri(TOKEN_URL)
//                .header(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded;charset=utf-8")
//                .bodyValue("grant_type=authorization_code"
//                        + "&client_id=" + clientId
//                        + "&redirect_uri=" + redirectUri
//                        + "&code=" + code)
//                .retrieve()
//                .bodyToMono(JsonNode.class)
//                .block()
//                .get("access_token").asText();
//    }
    
    // 이거
//    private String getKakaoAccessToken(String code) {
//        return webClient.post()
//                .uri(TOKEN_URL)
//                .header(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded;charset=utf-8")
//                .bodyValue("grant_type=authorization_code"
//                        + "&client_id=" + clientId
//                        + "&redirect_uri=" + redirectUri
//                        + "&code=" + code)
//                .retrieve()
//                .bodyToMono(JsonNode.class)
//                .block()
//                .get("access_token").asText();
//    }

//    /**
//     * 카카오 사용자 정보 가져오기 (WebClient 사용)
//     */
//    private KakaoUsers getKakaoUserInfo(String accessToken) {
//        JsonNode userInfo = webClient.get()
//                .uri(USER_INFO_URL)
//                .header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
//                .header(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded;charset=utf-8")
//                .retrieve()
//                .bodyToMono(JsonNode.class)
//                .block();
//
//        String kakaoId = userInfo.get("id").asText();
//        String userEmail = userInfo.get("kakao_account").has("email")
//                ? userInfo.get("kakao_account").get("email").asText()
//                : null;
//        String userName = userInfo.get("properties").get("nickname").asText();
//        String sysFile = userInfo.get("properties").has("profile_image")
//                ? userInfo.get("properties").get("profile_image").asText()
//                : null;
//        String originFile = sysFile;
//
//        return new KakaoUsers(kakaoId, userEmail, userName, sysFile, originFile, 2L);
//    }
    
// 이거    
//    private Users getKakaoUserInfo(String accessToken) {
//    	JsonNode userInfo = webClient.get()
//    			.uri(USER_INFO_URL)
//    			.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken)
//    			.header(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded;charset=utf-8")
//    			.retrieve()
//    			.bodyToMono(JsonNode.class)
//    			.block();
//    	
//    	String providerId = userInfo.get("id").asText();
//    	String userEmail = userInfo.get("kakao_account").has("email")
//    
//    }
}
