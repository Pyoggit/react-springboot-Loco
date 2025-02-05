package com.loco.aroundme.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsersMapper usersMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthController(UsersMapper usersMapper, JwtUtil jwtUtil, BCryptPasswordEncoder passwordEncoder) {
        this.usersMapper = usersMapper;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    // Userscontroller에서 처리하고 잇어서 안써도 됨 
//    // 회원가입 API (CORS 허용)
//    @CrossOrigin(origins = "http://localhost:5173")
//    @PostMapping("/signup")
//    public ResponseEntity<String> signup(@RequestBody Users user) throws Exception {
//        if (usersMapper.read(user.getUserEmail()) != null) {
//            return ResponseEntity.badRequest().body("이미 사용 중인 이메일입니다.");
//        }
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        usersMapper.insertUser(user);
//        return ResponseEntity.ok("회원가입 성공!");
//    }

    // 로그인 API (CORS 허용)
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        Users users = usersMapper.read(email);
        if (users == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email"));
        }
        if (!passwordEncoder.matches(password, users.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid password"));
        }

        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token", token));
    }
}
