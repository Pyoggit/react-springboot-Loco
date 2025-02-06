package com.loco.aroundme.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.loco.aroundme.domain.KakaoUsers;
import com.loco.aroundme.service.KakaoUsersService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/auth/kakao")
@RequiredArgsConstructor
@Slf4j
public class KakaoAuthController {

	private final KakaoUsersService kakaoUsersService;
	private final RestTemplate restTemplate = new RestTemplate();

	@Value("${kakao.client-id}") // 카카오 REST API KEY (application.properties에서 설정)
	private String clientId;

	@Value("${kakao.redirect-uri}") // 카카오 리디렉트 URI
	private String redirectUri;

	private static final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";
	private static final String USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

	@PostMapping("/callback")
	public ResponseEntity<?> kakaoLogin(@RequestParam("code") String code) {
		log.info("카카오 로그인 코드: {}", code);

		// 카카오 서버에서 Access Token 가져오기
		String accessToken = getKakaoAccessToken(code);
		if (accessToken == null) {
			log.error("카카오 액세스 토큰 요청 실패");
			return ResponseEntity.badRequest().body("카카오 로그인 실패");
		}
		log.info("카카오 액세스 토큰: {}", accessToken);

		// 카카오 사용자 정보 가져오기
		KakaoUsers kakaoUser = getKakaoUserInfo(accessToken);
		if (kakaoUser == null) {
			log.error("카카오 사용자 정보 요청 실패");
			return ResponseEntity.badRequest().body("카카오 로그인 실패");
		}
		log.info("카카오 사용자 정보: {}", kakaoUser);

		// DB에 사용자 저장 (이미 존재하면 업데이트 X)
		Optional<KakaoUsers> existingUser = kakaoUsersService.findByKakaoId(kakaoUser.getKakaoId());
		if (existingUser.isEmpty()) {
			kakaoUsersService.registerKakaoUser(kakaoUser);
			log.info("새로운 카카오 사용자 등록 완료");
		} else {
			log.info("기존 카카오 사용자 로그인 성공");
		}

		// 4️⃣ 로그인 성공 후 Access Token 반환
		return ResponseEntity.ok().body("{\"accessToken\": \"" + accessToken + "\"}");
	}

	/**
	 * 카카오 Access Token 요청
	 */
	private String getKakaoAccessToken(String code) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

		String requestBody = "grant_type=authorization_code" + "&client_id=" + clientId + "&redirect_uri=" + redirectUri
				+ "&code=" + code;

		HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
		ResponseEntity<JsonNode> response = restTemplate.exchange(TOKEN_URL, HttpMethod.POST, entity, JsonNode.class);

		return response.getBody().get("access_token").asText();
	}

	/**
	 * 2. Access Token으로 카카오 사용자 정보 가져오기
	 */
	private KakaoUsers getKakaoUserInfo(String accessToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + accessToken);
		headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

		HttpEntity<String> entity = new HttpEntity<>("", headers);
		ResponseEntity<JsonNode> response = restTemplate.exchange(USER_INFO_URL, HttpMethod.GET, entity,
				JsonNode.class);

		JsonNode userInfo = response.getBody();
		String kakaoId = userInfo.get("id").asText();
		String userEmail = userInfo.get("kakao_account").has("email")
				? userInfo.get("kakao_account").get("email").asText()
				: null; // userEmail로 변경
		String userName = userInfo.get("properties").get("nickname").asText(); // 변수명 nickname -> userName 
		String sysFile = userInfo.get("properties").has("profile_image")
				? userInfo.get("properties").get("profile_image").asText()
				: null; // sysFile로 변경
		String originFile = sysFile; // originFile도 동일하게 설정

		return new KakaoUsers(kakaoId, userEmail, userName, sysFile, originFile, 2L);
	}

}
