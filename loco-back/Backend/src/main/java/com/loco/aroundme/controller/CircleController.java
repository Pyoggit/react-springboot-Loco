package com.loco.aroundme.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.service.CircleService;

@RestController
@RequestMapping("/api/circles")
@CrossOrigin(origins = "http://localhost:5173") // React 개발 서버 허용
public class CircleController {

    @Value("${upload.path}") // ✅ 파일 저장 경로 (application.properties에서 설정)
    private String uploadDir;

    @Autowired
    private CircleService circleService; // ✅ `@Autowired`로 서비스 주입

    /** ✅ 1. 특정 날짜의 모임 리스트 반환 */
    @GetMapping
    public ResponseEntity<?> getCirclesByDate(@RequestParam(required = false) String date) {
        try {
            System.out.println("📅 요청된 날짜: " + date);

            List<Circle> circles;
            if (date != null && !date.isEmpty()) {
                circles = circleService.getCirclesByDate(date);
            } else {
                circles = circleService.getAllCircles();
            }

            // ✅ 데이터 확인
            for (Circle circle : circles) {
                System.out.println("📥 조회된 모임 데이터: " + circle.getCircleName() + ", 이미지: " + circle.getPictureUrl());
            }

            return ResponseEntity.ok(circles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"모임 데이터를 불러오는 중 오류 발생: " + e.getMessage() + "\"}");
        }
    }
    /** ✅ 2. 새 모임 생성 API */
    @PostMapping
    public ResponseEntity<?> createCircle(@RequestBody Circle circle) {
        try {
            System.out.println("🔍 요청 받은 데이터: " + circle.toString());

            // ✅ circleDate 변환 (String → Timestamp)
            Timestamp timestampDate = circle.getCircleDateAsTimestamp();
            circle.setCircleDate(timestampDate.toString()); // ✅ 변환된 Timestamp 저장
            System.out.println("✅ 변환된 circleDate: " + circle.getCircleDate());

            // ✅ DB 저장
            circleService.createCircle(circle);

            return ResponseEntity.ok().body("{\"message\": \"모임이 성공적으로 생성되었습니다.\"}");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("{\"message\": \"모임 생성 실패: " + e.getMessage() + "\"}");
        }
    }
    @DeleteMapping("/{circleId}")
    public ResponseEntity<?> deleteCircle(@PathVariable Long circleId) {
        try {
            System.out.println("🗑️ 삭제 요청 받은 ID: " + circleId);
            circleService.deleteCircle(circleId);
            return ResponseEntity.ok().body("{\"message\": \"모임이 삭제되었습니다.\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"message\": \"삭제 실패: " + e.getMessage() + "\"}");
        }
    }
}
