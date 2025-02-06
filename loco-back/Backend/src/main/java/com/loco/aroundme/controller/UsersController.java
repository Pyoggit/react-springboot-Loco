package com.loco.aroundme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Users;
import com.loco.aroundme.service.UsersService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users") // ✅ 프론트와 URL 맞춤
@RequiredArgsConstructor
public class UsersController {

    private final UsersService usersService;

    // 회원가입 API (경로 /users/signup)
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(
            @RequestPart("user") Users user, // JSON을 바로 Users 객체로 받음!
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
}
