package com.loco.aroundme.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
//@RequestMapping("/users") // 프론트와 URL 맞춤
@RequestMapping("/api/users") // 모든 유저 관련 API는 /api/users 경로로.. 리액트도 수정함
@RequiredArgsConstructor
public class UsersController {

	private final UsersService usersService;
	private final UsersMapper usersMapper;
	private final JwtUtil jwtUtil;
	private final BCryptPasswordEncoder passwordEncoder;

//	@Autowired
//	public UsersController(UsersService usersService, UsersMapper usersMapper, JwtUtil jwtUtil,
//			BCryptPasswordEncoder passwordEncoder) {
//		this.usersService = usersService;
//		this.usersMapper = usersMapper;
//		this.jwtUtil = jwtUtil;
//		this.passwordEncoder = passwordEncoder;
//	}

	// 회원가입 API (경로 /users/signup)
	@PostMapping("/signup")
	public ResponseEntity<String> registerUser(@RequestPart("user") Users user, // JSON을 바로 Users 객체로 받음!
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

	// 이메일 중복 체크 API
	@GetMapping("/check-email")
	public ResponseEntity<Boolean> checkEmail(@RequestParam String email) {
		Users existingUser = usersService.findByEmail(email);
		return ResponseEntity.ok(existingUser == null);
	}

	@PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

        System.out.println("일반 유저 로그인 요청");
        System.out.println("요청 데이터: " + loginRequest);

        String userEmail = loginRequest.get("email");
        String password = loginRequest.get("password");

        Users user = usersMapper.read(userEmail);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        System.out.println("*user=" + user);

        // roleId 가져오기
        Long roleId = user.getRoleId();
        System.out.println("roleId : " + roleId);

        // role 변환 (roleId가 1이면 관리자, 그 외는 일반 유저)
        String role = (roleId == 1) ? "ROLE_ADMIN" : "ROLE_USER";
        System.out.println("role 변환 결과: " + role);

        // 일반 유저만 로그인 가능 (ROLE_ADMIN 차단)
        if (!role.equals("ROLE_USER")) {
            System.out.println("일반 유저 권한이 아님 roleId: " + roleId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
        }

        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(userEmail, roleId);
        String refreshToken = jwtUtil.generateRefreshToken(userEmail);
        
        System.out.println("accessToken:" + accessToken);
        System.out.println("refreshToken:" + refreshToken);

        return ResponseEntity.ok().header("Refresh-Token", refreshToken).body(Map.of("accessToken", accessToken));
    }

}
