package com.loco.aroundme.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;
import com.loco.aroundme.service.UsersService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/auth/kakao")
@RequiredArgsConstructor
@Slf4j
public class KakaoAuthController {

	private final UsersService usersService;
	private final UsersMapper usersMapper;
	private final JwtUtil jwtUtil;
	private final WebClient webClient = WebClient.create();
	private final BCryptPasswordEncoder passwordEncoder;

	@Value("${kakao.client-id}")
	private String clientId;

	@Value("${kakao.redirect-uri}")
	private String redirectUri;

	private static final String TOKEN_URL = "https://kauth.kakao.com/oauth/token";
	private static final String USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";

	/**
	 * 🔥 카카오 로그인 처리 (인가 코드 -> 액세스 토큰 -> 사용자 정보 -> JWT 발급)
	 */
//	@PostMapping("/callback")
//	public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> request) {
//	    String code = request.get("code");
//	    log.info("🔹 카카오 로그인 요청 코드: {}", code);
//
//	    if (code == null || code.isEmpty()) {
//	        return ResponseEntity.badRequest().body(Map.of("error", "카카오 로그인 실패: 인가 코드 없음"));
//	    }
//
//	    String kakaoAccessToken = getKakaoAccessToken(code);
//	    if (kakaoAccessToken == null) {
//	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "카카오 액세스 토큰 요청 실패"));
//	    }
//
//	    Users kakaoUser = getKakaoUserInfo(kakaoAccessToken);
//	    if (kakaoUser == null) {
//	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "카카오 사용자 정보 요청 실패"));
//	    }
//
//	    // 🔹 기존 사용자 여부 확인
//	    Users existingUser = usersMapper.read(kakaoUser.getUserEmail());
//
//	    log.info("🔹 usersMapper.read 결과: {}", existingUser); 
//
//	    if (existingUser == null) {
//	        // 🔥 신규 사용자 → 회원가입 진행
//	        log.info("🔥 신규 사용자! 회원가입 진행");
//	        usersMapper.insertUser(kakaoUser);
//
//	        try {
//	            // 💡 DB 반영 대기 (트랜잭션 지연 문제 방지)
//	            Thread.sleep(100);
//	        } catch (InterruptedException e) {
//	            e.printStackTrace();
//	        }
//
//	        // 🔍 회원가입 후 다시 조회 (💥 핵심!)
//	        existingUser = usersMapper.read(kakaoUser.getUserEmail());
//
//	        if (existingUser == null) {
//	            log.error("🚨 회원가입 후에도 usersMapper.read(email)이 null 반환! DB 반영 확인 필요!");
//	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//	                .body(Map.of("error", "회원가입 실패"));
//	        }
//	    }
//
//	    // ✅ JWT 토큰 발급
//	    String accessToken = jwtUtil.generateAccessToken(existingUser);
//	    String refreshToken = jwtUtil.generateRefreshToken(existingUser);
//
//	    log.info("✅ 생성된 Access Token: {}", accessToken);
//	    log.info("✅ 생성된 Refresh Token: {}", refreshToken);
//
//	    // ✅ 쿠키에 저장할 토큰 설정
//	    ResponseCookie accessTokenCookie = ResponseCookie.from("kakao_accessToken", accessToken)
//	            .httpOnly(true)
//	            .secure(false)
//	            .sameSite("Lax")
//	            .path("/")
//	            .maxAge(60 * 60)
//	            .build();
//
//	    ResponseCookie refreshTokenCookie = ResponseCookie.from("kakao_refreshToken", refreshToken)
//	            .httpOnly(true)
//	            .secure(false)
//	            .sameSite("Lax")
//	            .path("/")
//	            .maxAge(7 * 24 * 60 * 60)
//	            .build();
//
//	    log.info("✅ Set-Cookie 헤더 카카오엑세스토큰: {}", accessTokenCookie.toString());
//	    log.info("✅ Set-Cookie 헤더 카카오리프레시토큰: {}", refreshTokenCookie.toString());
//
//	    // ✅ tokens Map 생성
//	    Map<String, String> tokens = Map.of("kakao_accessToken", accessToken, "kakao_refreshToken", refreshToken);
//
//	    // ✅ 사용자 정보 Map 생성
//	    Map<String, Object> user = Map.of(
//	        "userId", existingUser.getUserId(), 
//	        "email", existingUser.getUserEmail(),
//	        "userName", existingUser.getUserName(), 
//	        "role", existingUser.getRoleId() == 1L ? "ROLE_ADMIN" : "ROLE_USER"
//	    );
//
//	    // ✅ 리디렉트 경로 설정
//	    String redirectUrl = (existingUser.getRoleId() == 2L) ? "/resign-kakao" : "/";
//
//	    return ResponseEntity.ok()
//	            .header("Authorization", "Bearer " + accessToken)
//	            .header(HttpHeaders.SET_COOKIE, accessTokenCookie.toString())
//	            .header(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString())
//	            .body(Map.of("tokens", tokens, "user", user, "redirect", redirectUrl));
//	}
	@PostMapping("/callback")
	public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> request) {
	    String code = request.get("code");
	    log.info("🔹 카카오 로그인 요청 코드: {}", code);

	    if (code == null || code.isEmpty()) {
	        return ResponseEntity.badRequest().body(Map.of("error", "카카오 로그인 실패: 인가 코드 없음"));
	    }

	    String kakaoAccessToken = getKakaoAccessToken(code);
	    if (kakaoAccessToken == null) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "카카오 액세스 토큰 요청 실패"));
	    }

	    Users kakaoUser = getKakaoUserInfo(kakaoAccessToken);
	    if (kakaoUser == null) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "카카오 사용자 정보 요청 실패"));
	    }

	    // 🔹 기존 사용자 여부 확인
	    Users existingUser = usersMapper.read(kakaoUser.getUserEmail());
	    boolean isNewUser = false; // ✅ 신규 사용자 체크

	    if (existingUser == null) {
	        log.info("🔥 신규 사용자! 회원가입 진행");
	        usersMapper.insertUser(kakaoUser);
	        isNewUser = true; // ✅ 신규 가입했으므로 true

	        try {
	            Thread.sleep(100); // 데이터베이스 반영 기다리기
	        } catch (InterruptedException e) {
	            e.printStackTrace();
	        }

	        existingUser = usersMapper.read(kakaoUser.getUserEmail()); // 새로 가입한 유저 불러오기
	        if (existingUser == null) {
	            log.error("🚨 회원가입 후에도 DB에서 사용자 정보를 찾을 수 없음!");
	            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "회원가입 실패"));
	        }
	    }

	    log.info("📌 로그인한 사용자 정보: {}", existingUser);
	    log.info("📌 isNewUser: {}", isNewUser);

	    // ✅ roleId 확인 후 리디렉트 URL 설정
	    String redirectUrl;
	    if (isNewUser) {
	        redirectUrl = "/resign-kakao"; // 🔥 신규 사용자는 회원가입 완료해야 함!
	    } else if (existingUser.getRoleId() == 1L) {
	        redirectUrl = "/adminpage"; // ✅ 관리자 페이지
	    } else {
	        redirectUrl = "/"; // ✅ 일반 사용자 메인 페이지
	    }

	    log.info("✅ 최종 리디렉트 URL: {}", redirectUrl);

	    // ✅ JWT 토큰 발급
	    String kakaoAccessTokenJwt = jwtUtil.generateAccessToken(existingUser);
	    String kakaoRefreshTokenJwt = jwtUtil.generateRefreshToken(existingUser);

	    return ResponseEntity.ok(Map.of(
	        "tokens", Map.of( // ✅ 프론트엔드가 localStorage에 저장할 JSON 응답으로 변경
	            "kakao_accessToken", kakaoAccessTokenJwt,
	            "kakao_refreshToken", kakaoRefreshTokenJwt
	        ),
	        "user", Map.of(
	            "userId", existingUser.getUserId(),
	            "email", existingUser.getUserEmail(),
	            "userName", existingUser.getUserName(),
	            "role", existingUser.getRoleId(),
	            "profileImage", existingUser.getOriginUser()
	        ),
	        "redirect", redirectUrl
	    ));
	}








	/**
	 * 🔥 카카오 서버에서 액세스 토큰 요청
	 */
	private String getKakaoAccessToken(String code) {
		log.info("📌 인가 코드 수신: {}", code);

		Map<String, Object> tokenResponse = webClient.post().uri(TOKEN_URL)
				.header(HttpHeaders.CONTENT_TYPE, "application/x-www-form-urlencoded;charset=utf-8")
				.bodyValue("grant_type=authorization_code&client_id=" + clientId + "&redirect_uri=" + redirectUri
						+ "&code=" + code)
				.retrieve().bodyToMono(Map.class).block();

		if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
			log.error("🚨 카카오 액세스 토큰 요청 실패! 응답: {}", tokenResponse);
			return null;
		}

		String kakaoAccessToken = (String) tokenResponse.get("access_token");
		log.info("✅ 카카오 액세스 토큰 수신: {}", kakaoAccessToken);
		return kakaoAccessToken;
	}

	/**
	 * 🔥 카카오 사용자 정보 가져오기
	 */
	private Users getKakaoUserInfo(String accessToken) {
		Map<String, Object> userInfo = webClient.get().uri(USER_INFO_URL)
				.header(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken).retrieve().bodyToMono(Map.class).block();

		if (userInfo == null) {
			log.error("🚨 카카오 사용자 정보 요청 실패: 응답이 null");
			return null;
		}

		Object idObj = userInfo.get("id");
		if (idObj == null) {
			log.error("🚨 카카오 사용자 ID가 없습니다.");
			return null;
		}
		String providerId = idObj.toString();

		Map<String, Object> kakaoAccount = (Map<String, Object>) userInfo.get("kakao_account");
		if (kakaoAccount == null) {
			log.warn("⚠️ 카카오 계정 정보 없음 (ID={})", providerId);
			return null;
		}

		// ✅ 이메일 직접 가져오기 (email_needs_agreement 체크)
		String email = null;
		if (kakaoAccount.containsKey("email")) {
			email = kakaoAccount.get("email").toString();
		} else {
			log.warn("⚠️ 카카오 계정에 이메일 정보가 없습니다.");
		}

		// ✅ email_needs_agreement 체크 (사용자가 이메일 제공에 동의했는지 확인)
		Boolean emailNeedsAgreement = (Boolean) kakaoAccount.get("email_needs_agreement");
		if (emailNeedsAgreement != null && emailNeedsAgreement) {
			log.warn("⚠️ 사용자가 이메일 제공에 동의하지 않았습니다. 기본 이메일 설정.");
			email = providerId + "@kakao.com";
		}

		// ✅ 닉네임 가져오기
		Map<String, Object> properties = (Map<String, Object>) userInfo.get("properties");
		String nickname = properties != null ? properties.getOrDefault("nickname", "카카오 유저").toString() : "카카오 유저";

		// ✅ 프로필 이미지 가져오기
		String profile = null;
		if (kakaoAccount.containsKey("profile")) {
			Map<String, Object> profileMap = (Map<String, Object>) kakaoAccount.get("profile");
			if (profileMap.containsKey("profile_image_url")) {
				profile = profileMap.get("profile_image_url").toString();
			}
		}
		if (profile == null) {
			log.warn("⚠️ 프로필 이미지가 없습니다. 기본 이미지 설정");
			profile = "default-profile.png";
		}

		// ✅ User 객체 생성
		return Users.builder().provider("KAKAO").providerId(providerId).userEmail(email) // ✅ 이메일 직접 설정
				.password(passwordEncoder.encode("1234")).roleId(2L).userName(nickname).originUser(profile)
				.sysUser(profile).build();
	}

//    @GetMapping("/temp-user")
//    public ResponseEntity<?> getTempKakaoUser(@CookieValue(name = "kakao_accessToken", required = false) String kakaoAccessToken) {
//        if (kakaoAccessToken == null) {
//            log.error("🚨 쿠키에서 kakao_accessToken을 찾을 수 없습니다.");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "쿠키에 액세스 토큰 없음"));
//        }
//
//        log.info("✅ 쿠키에서 가져온 kakao_accessToken: {}", kakaoAccessToken);
//
//        // ✅ JWT 토큰 검증
//        if (!jwtUtil.validateToken(kakaoAccessToken)) {
//            log.error("🚨 유효하지 않은 kakao_accessToken.");
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "유효하지 않은 토큰"));
//        }
//
//        // ✅ JWT에서 이메일 추출
//        String email = jwtUtil.getUserEmail(kakaoAccessToken);
//        log.info("✅ kakao_accessToken으로 찾은 이메일: {}", email);
//
//        // ✅ DB에서 유저 정보 조회
//        Users kakaoUser = usersService.read(email);
//        if (kakaoUser == null) {
//            log.error("🚨 유저 정보를 찾을 수 없습니다.");
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "유저 정보 없음"));
//        }
//
//        return ResponseEntity.ok(kakaoUser);
//    }

//	@GetMapping("/temp-user")
//    public ResponseEntity<?> getTempKakaoUser(@RequestHeader("Cookie") String cookies) {

//	@GetMapping("/temp-user")
//	public ResponseEntity<?> getTempKakaoUser(@CookieValue(name = "kakao_accessToken", required = false) String kakaoAccessToken) { 
//		log.info("✅ 쿠키에서 가져온 kakao_accessToken１: {}", kakaoAccessToken);
//		if (kakaoAccessToken == null) {
//	        log.error("🚨 쿠키에서 kakao_accessToken을 찾을 수 없습니다.");
//	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "쿠키에 액세스 토큰 없음"));
//	    }
//
//	    log.info("✅ 쿠키에서 가져온 kakao_accessToken２: {}", kakaoAccessToken);
//
//	    if (!jwtUtil.validateToken(kakaoAccessToken)) {
//	        log.error("🚨 유효하지 않은 kakao_accessToken.");
//	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "유효하지 않은 토큰"));
//	    }
//
//	    String email = jwtUtil.getUserEmail(kakaoAccessToken);
//	    log.info("✅ kakao_accessToken으로 찾은 이메일: {}", email);
//
//	    Users kakaoUser = usersService.read(email);
//	    if (kakaoUser == null) {
//	        log.error("🚨 유저 정보를 찾을 수 없습니다.");
//	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "유저 정보 없음"));
//	    }
//
//	    return ResponseEntity.ok(kakaoUser);
//	}

	@GetMapping("/temp-user")
	public ResponseEntity<?> getTempKakaoUser(
			@RequestHeader(value = "Authorization", required = false) String authorizationHeader,
			@CookieValue(name = "kakao_accessToken", required = false) String kakaoAccessToken) {

		// 🔍 우선 Authorization 헤더에서 토큰 가져오기
		String token = null;
		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			token = authorizationHeader.substring(7);
			log.info("✅ Authorization 헤더에서 가져온 kakao_accessToken: {}", token);
		} else if (kakaoAccessToken != null) {
			// 🔍 Authorization 헤더가 없으면 쿠키에서 토큰 가져오기
			token = kakaoAccessToken;
			log.info("✅ 쿠키에서 가져온 kakao_accessToken: {}", token);
		}

		if (token == null) {
			log.error("🚨 토큰을 찾을 수 없습니다. (Authorization 헤더 및 쿠키 없음)");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "토큰 없음"));
		}

		// ✅ 토큰 유효성 검사
		if (!jwtUtil.validateToken(token)) {
			log.error("🚨 유효하지 않은 kakao_accessToken.");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "유효하지 않은 토큰"));
		}

		// ✅ 토큰에서 이메일 추출
		String email = jwtUtil.getUserEmail(token);
		log.info("✅ 토큰에서 찾은 이메일: {}", email);

		// ✅ DB에서 유저 정보 조회
		Users kakaoUser = usersService.read(email);
		if (kakaoUser == null) {
			log.error("🚨 유저 정보를 찾을 수 없습니다.");
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "유저 정보 없음"));
		}

		return ResponseEntity.ok(Map.of("userId", kakaoUser.getUserId(), "email", kakaoUser.getUserEmail(), "userName",
				kakaoUser.getUserName(), "role", kakaoUser.getRoleId(), "gender",
				kakaoUser.getGender() == null ? "" : kakaoUser.getGender(), "birthDate",
				kakaoUser.getBirth() == null ? "" : kakaoUser.getBirth(), "profileImage",
				kakaoUser.getOriginUser() == null ? "" : kakaoUser.getOriginUser()));
	}

	@PostMapping("/complete-register")
	public ResponseEntity<?> completeKakaoRegister(@RequestBody Map<String, Object> userData) throws Exception {
	    log.info("✅ 카카오 추가 정보 입력 완료: {}", userData);

	    // 1️⃣ 이메일을 가져옴
	    String email = (String) userData.get("userEmail");

	    // 2️⃣ 기존 사용자 확인
	    Users user = usersService.read(email);
	    if (user == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "유저 정보 없음"));
	    }

	    // 3️⃣ 추가 정보 저장
	    user.setPassword(passwordEncoder.encode((String) userData.get("password")));
	    user.setUserName((String) userData.get("userName"));
	    user.setGender((String) userData.get("gender"));
	    user.setMobile1((String) userData.get("mobile1"));
	    user.setMobile2((String) userData.get("mobile2"));
	    user.setMobile3((String) userData.get("mobile3"));
	    user.setPhone1((String) userData.get("phone1"));
	    user.setPhone2((String) userData.get("phone2"));
	    user.setPhone3((String) userData.get("phone3"));
	    user.setBirth((String) userData.get("birth"));
	    user.setZipcode((String) userData.get("zipcode"));
	    user.setAddress1((String) userData.get("address1"));
	    user.setAddress2((String) userData.get("address2"));

	    usersService.updateUser(user);

	    // 4️⃣ 성공 응답 반환
	    return ResponseEntity.ok(Map.of("message", "회원가입 완료", "redirect", "/login"));
	}


}
