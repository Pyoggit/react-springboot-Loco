package com.loco.aroundme.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/users") // 모든 유저 관련 API는 /api/users 경로로 통합
@RequiredArgsConstructor
public class UsersController {

	private final UsersService usersService;
	private final UsersMapper usersMapper;
	private final JwtUtil jwtUtil;
	private final BCryptPasswordEncoder passwordEncoder;

	/**
	 * 회원가입 API (경로: /api/users/signup) JSON 데이터는 Users 객체로, 프로필 사진은 MultipartFile로
	 * 수신
	 */
	@PostMapping("/signup")
	public ResponseEntity<String> registerUser(@RequestPart("user") Users user,
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
		Users existingUser = usersService.read(email);
		return ResponseEntity.ok(existingUser == null);
	}

	/**
	 * 일반 사용자 로그인 API (경로: /api/users/login)
	 */
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
		String userEmail = loginRequest.get("email");
		String password = loginRequest.get("password");

		Users user = usersMapper.read(userEmail);
		if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
		}

		String normalAccessToken = jwtUtil.generateAccessToken(user);
		String normalRefreshToken = jwtUtil.generateRefreshToken(user);

		return ResponseEntity.ok(Map.of("normal_accessToken", normalAccessToken, // ✅ JSON 응답 추가
				"normal_refreshToken", normalRefreshToken, "user", Map.of("userId", user.getUserId(), "email",
						user.getUserEmail(), "userName", user.getUserName(), "role", "ROLE_USER")));
	}

	/**
	 * ✅ 일반 사용자 & 카카오 사용자 로그아웃 API 경로: /api/users/logout
	 */
	@PostMapping("/logout")
	public ResponseEntity<String> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
		if (authHeader == null || !authHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No token found in headers");
		}

		String token = authHeader.substring(7); // "Bearer " 제거 후 토큰만 추출

		// ✅ JWT 블랙리스트에 추가 (선택 사항)
		jwtUtil.addToBlacklist(token);

		return ResponseEntity.ok("✅ 로그아웃 성공!");
	}

	/**
	 * 로그인한 사용자 정보 가져오기 (경로: /api/users/mypage)
	 */
//	@GetMapping("/mypage")
//	public ResponseEntity<?> getCurrentUser(
//			@CookieValue(value = "normal_accessToken", required = false) String normalToken,
//			@CookieValue(value = "kakao_accessToken", required = false) String kakaoToken) {
//
//		// ✅ 둘 다 없으면 401 에러 반환
//		if (normalToken == null && kakaoToken == null) {
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No token found in cookies"));
//		}
//
//		// ✅ 쿠키에서 가져온 토큰 중 하나 사용
//		String token = (normalToken != null) ? normalToken : kakaoToken;
//
//		// ✅ 블랙리스트 체크
//		if (jwtUtil.isBlacklisted(token)) {
//			System.out.println("🚨 블랙리스트에 등록된 토큰: " + token);
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token is blacklisted"));
//		}
//
//		// ✅ 토큰 유효성 검사
//		if (!jwtUtil.validateToken(token)) {
//			System.out.println("🚨 유효하지 않은 토큰: " + token);
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
//		}
//
//		// ✅ 토큰에서 이메일 가져오기
//		String userEmail = jwtUtil.getUserEmail(token);
//		if (userEmail == null) {
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//					.body(Map.of("error", "Failed to extract email from token"));
//		}
//
//		// ✅ DB에서 사용자 조회
//		Users user = usersMapper.read(userEmail);
//		if (user == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
//		}
//
//		// ✅ 정상 응답 반환
//		return ResponseEntity
//				.ok(Map.ofEntries(Map.entry("userId", user.getUserId()), Map.entry("email", user.getUserEmail()),
//						Map.entry("userName", user.getUserName()), Map.entry("role", user.getRoleId()),
//						Map.entry("gender", user.getGender() == null ? "" : user.getGender()),
//						Map.entry("mobile1", user.getMobile1() == null ? "" : user.getMobile1()),
//						Map.entry("mobile2", user.getMobile2() == null ? "" : user.getMobile2()),
//						Map.entry("mobile3", user.getMobile3() == null ? "" : user.getMobile3()),
//						Map.entry("phone1", user.getPhone1() == null ? "" : user.getPhone1()),
//						Map.entry("phone2", user.getPhone2() == null ? "" : user.getPhone2()),
//						Map.entry("phone3", user.getPhone3() == null ? "" : user.getPhone3()),
//						Map.entry("birthDate", user.getBirth() == null ? "" : user.getBirth()),
//						Map.entry("zipcode", user.getZipcode() == null ? "" : user.getZipcode()),
//						Map.entry("address", user.getAddress1() == null ? "" : user.getAddress1()),
//						Map.entry("detailAddress", user.getAddress2() == null ? "" : user.getAddress2()),
//						Map.entry("profileImage", user.getOriginUser() == null ? "" : user.getOriginUser())));
//	}
	@GetMapping("/mypage")
	public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authorizationHeader) {
		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "토큰이 없습니다."));
		}

		String token = authorizationHeader.substring(7); // "Bearer " 이후의 토큰 값 추출

		if (!jwtUtil.validateToken(token)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "유효하지 않은 토큰"));
		}

		String userEmail = jwtUtil.getUserEmail(token);
		Users user = usersMapper.read(userEmail);

		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "유저 정보를 찾을 수 없습니다."));
		}

		 // ✅ 프로필 이미지 URL 설정 (기본값 추가)
	    String profileImage = (user.getSysUser() != null && !user.getSysUser().isEmpty())
	        ? "/upload/" + user.getSysUser()  // ✅ 업로드된 이미지 사용
	        : "/images/default-image.png";  // ✅ 기본 이미지
	    
		return ResponseEntity
				.ok(Map.ofEntries(Map.entry("userId", user.getUserId()), Map.entry("email", user.getUserEmail()),
						Map.entry("userName", user.getUserName()), Map.entry("role", user.getRoleId()),
						Map.entry("gender", user.getGender() == null ? "" : user.getGender()),
						Map.entry("mobile1", user.getMobile1() == null ? "" : user.getMobile1()),
						Map.entry("mobile2", user.getMobile2() == null ? "" : user.getMobile2()),
						Map.entry("mobile3", user.getMobile3() == null ? "" : user.getMobile3()),
						Map.entry("phone1", user.getPhone1() == null ? "" : user.getPhone1()),
						Map.entry("phone2", user.getPhone2() == null ? "" : user.getPhone2()),
						Map.entry("phone3", user.getPhone3() == null ? "" : user.getPhone3()),
						Map.entry("birthDate", user.getBirth() == null ? "" : user.getBirth()),
						Map.entry("zipcode", user.getZipcode() == null ? "" : user.getZipcode()),
						Map.entry("address", user.getAddress1() == null ? "" : user.getAddress1()),
						Map.entry("detailAddress", user.getAddress2() == null ? "" : user.getAddress2()),
						Map.entry("profileImage", user.getOriginUser() == null ? "" : user.getOriginUser())));
	}

//	@PutMapping("/update")
//	public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String authorizationHeader,
//			@RequestPart("user") Users user,
//			@RequestPart(value = "profileImage", required = false) MultipartFile profileImage) throws Exception {
//
//		if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "토큰이 없습니다."));
//		}
//
//		String token = authorizationHeader.substring(7);
//
//		if (!jwtUtil.validateToken(token)) {
//			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "유효하지 않은 토큰"));
//		}
//
//		String userEmail = jwtUtil.getUserEmail(token);
//		Users existingUser = usersMapper.read(userEmail);
//
//		if (existingUser == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "유저 정보를 찾을 수 없습니다."));
//		}
//
//		// 기존 유저 정보 업데이트
//		existingUser.setUserName(user.getUserName());
//		existingUser.setGender(user.getGender());
//		existingUser.setMobile1(user.getMobile1());
//		existingUser.setMobile2(user.getMobile2());
//		existingUser.setMobile3(user.getMobile3());
//		existingUser.setPhone1(user.getPhone1());
//		existingUser.setPhone2(user.getPhone2());
//		existingUser.setPhone3(user.getPhone3());
//		existingUser.setZipcode(user.getZipcode());
//		existingUser.setAddress1(user.getAddress1());
//		existingUser.setAddress2(user.getAddress2());
//
//		// ✅ 프로필 이미지 업데이트 반영
//		if (profileImage != null && !profileImage.isEmpty()) {
//			String newProfileImageUrl = usersService.uploadProfileImage(existingUser, profileImage);
//			existingUser.setOriginUser(newProfileImageUrl);
//		}
//
//		usersService.updateUser(existingUser);
//
//		return ResponseEntity.ok(Map.of("message", "회원정보가 성공적으로 수정되었습니다!"));
//	}

	@PutMapping("/update")
	public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String authorizationHeader,
			@RequestPart("user") Users user, // ✅ JSON 데이터는 @RequestPart로 받아야 함
			@RequestPart(value = "profileImage", required = false) MultipartFile profileImage) { // ✅ 파일은 @RequestPart

		try {
			if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "토큰이 없습니다."));
			}

			String token = authorizationHeader.substring(7);
			if (!jwtUtil.validateToken(token)) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "유효하지 않은 토큰"));
			}

			String userEmail = jwtUtil.getUserEmail(token);
			Users existingUser = usersMapper.read(userEmail);

			if (existingUser == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "유저 정보를 찾을 수 없습니다."));
			}

			// ✅ 기존 유저 정보 업데이트
			existingUser.setUserName(user.getUserName());
			existingUser.setGender(user.getGender());
			existingUser.setMobile1(user.getMobile1());
			existingUser.setMobile2(user.getMobile2());
			existingUser.setMobile3(user.getMobile3());
			existingUser.setPhone1(user.getPhone1());
			existingUser.setPhone2(user.getPhone2());
			existingUser.setPhone3(user.getPhone3());
			existingUser.setZipcode(user.getZipcode());
			existingUser.setAddress1(user.getAddress1());
			existingUser.setAddress2(user.getAddress2());

			// ✅ 프로필 이미지 처리
			if (profileImage != null && !profileImage.isEmpty()) {
				usersService.uploadProfileImage(existingUser, profileImage);
			}

			usersMapper.updateUser(existingUser);
//	        log.info("✅ 회원 정보 업데이트 완료: {}", existingUser.getUserEmail());
			log.info("✅ 회원 정보 업데이트 완료: {}", existingUser);

			return ResponseEntity.ok(Map.of("message", "회원정보가 성공적으로 수정되었습니다!"));

		} catch (Exception e) {
			log.error("❌ 회원 정보 업데이트 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "서버 오류가 발생했습니다.", "details", e.getMessage()));
		}
	}

	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteUser(
	        @RequestHeader("Authorization") String authorizationHeader,
	        @RequestBody Map<String, String> requestBody) throws Exception {

	    if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "토큰이 없습니다."));
	    }

	    String token = authorizationHeader.substring(7);
	    if (!jwtUtil.validateToken(token)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "유효하지 않은 토큰"));
	    }

	    String userEmail = jwtUtil.getUserEmail(token);
	    Users existingUser = usersMapper.read(userEmail);

	    if (existingUser == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "유저 정보를 찾을 수 없습니다."));
	    }

	    String inputPassword = requestBody.get("password");
	    if (inputPassword == null || !passwordEncoder.matches(inputPassword, existingUser.getPassword())) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "비밀번호가 올바르지 않습니다."));
	    }

	    usersService.deleteUser(userEmail);
	    return ResponseEntity.ok(Map.of("message", "회원 탈퇴가 완료되었습니다."));
	}

	@PostMapping("/auth/token/refresh")
	public ResponseEntity<?> refreshAccessToken(
			@RequestHeader(value = "Refresh-Token", required = false) String refreshToken) {

		if (refreshToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Refresh token missing"));
		}

		if (jwtUtil.isBlacklisted(refreshToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Token is blacklisted"));
		}

		if (!jwtUtil.validateToken(refreshToken)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid refresh token"));
		}

		String userEmail = jwtUtil.getUserEmail(refreshToken);
		Users user = usersMapper.read(userEmail);

		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not found"));
		}

		String newAccessToken = jwtUtil.generateAccessToken(user);

		return ResponseEntity.ok().header("Authorization", "Bearer " + newAccessToken) // ✅ 새 Access Token을 헤더로 반환
				.body(Map.of("accessToken", newAccessToken));
	}

}
