package com.loco.aroundme.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.service.CircleService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/circles")
@CrossOrigin(origins = "http://localhost:5173") // React 개발 서버 주소 허용
@RequiredArgsConstructor
public class CircleController {
    
    private final CircleService circleService;

    @PostMapping
    public ResponseEntity<String> createCircle(@RequestBody Circle circle) {
        circleService.createCircle(circle);
        return ResponseEntity.ok("모임이 저장되었습니다!");
    }
}