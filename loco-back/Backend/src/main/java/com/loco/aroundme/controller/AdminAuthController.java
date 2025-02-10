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
       
    	 System.out.println("로그인 요청"); 
    	    System.out.println("요청 데이터: " + loginRequest); // 유저가 보낸 요청 데이터
    	    
    	String userEmail = loginRequest.get("email");
        String password = loginRequest.get("password");

        Users user = usersMapper.read(userEmail);
        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        // roleId 가져오기
        Long roleId = user.getRoleId();
        System.out.println("roleId : " + roleId);

        String roleName = (roleId == 1) ? "ROLE_ADMIN" : "ROLE_USER";
        System.out.println("roleName 변환 결과: " + roleName);
        

        // 관리자만 로그인 가능 (roleId가 1이 아닐 경우 차단)
        if (!roleName.equals("ROLE_ADMIN")) {
            System.out.println("관리자 권한이 아님 roleId: " + roleId);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
        }
        // JWT 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(userEmail, roleId);
        String refreshToken = jwtUtil.generateRefreshToken(userEmail);

        return ResponseEntity.ok()
                .header("Refresh-Token", refreshToken)
                .body(Map.of("accessToken", accessToken));
    }
}
