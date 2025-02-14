package com.loco.aroundme.controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.service.CircleFileStorageService;
import com.loco.aroundme.service.CircleService;

@RestController
@RequestMapping("/api/circles")
@CrossOrigin(origins = "http://localhost:5173") // React 개발 서버 허용
public class CircleController {

	private final CircleService circleService;
	private final CircleFileStorageService fileStorageService;

	public CircleController(CircleService circleService, CircleFileStorageService fileStorageService) {
		this.circleService = circleService;
		this.fileStorageService = fileStorageService;
	}

	@Value("${upload.path}") // ✅ 파일 저장 경로 (application.properties에서 설정)
	private String uploadDir;

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

	// 삭제기능
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

	// 모임참석 기능
	@PostMapping("/{circleId}/attend")
	public ResponseEntity<?> attendCircle(@PathVariable Long circleId) {
		try {
			System.out.println("✅ 참석 요청된 circleId: " + circleId); // 로그 추가
			if (circleId == null) {
				return ResponseEntity.badRequest().body("{\"message\": \"모임 ID가 유효하지 않습니다.\"}");
			}

			boolean updated = circleService.attendCircle(circleId);
			if (!updated) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"모임이 이미 정원 초과 상태입니다.\"}");
			}

			return ResponseEntity.ok().body("{\"message\": \"모임 참석이 완료되었습니다.\"}");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("{\"message\": \"모임 참석 실패: " + e.getMessage() + "\"}");
		}
	}

	@PutMapping("/{circleId}")
	public ResponseEntity<?> updateCircle(@PathVariable int circleId,
			@RequestParam(value = "file", required = false) MultipartFile file,
			@RequestParam("circleName") String circleName, @RequestParam("circleCategory") String circleCategory,
			@RequestParam("circleDate") String circleDate, @RequestParam("circleMaxMember") int circleMaxMember,
			@RequestParam("circleDetail") String circleDetail, @RequestParam("circleAddress") String circleAddress,
			@RequestParam("circleLat") Double circleLat, @RequestParam("circleLng") Double circleLng,
			@RequestParam("circlePlaceId") String circlePlaceId) {
		try {
			// ✅ 기존 모임 정보 조회
			Circle existingCircle = circleService.findCircleById(circleId);
			if (existingCircle == null) {
				return ResponseEntity.status(404).body("{\"message\": \"존재하지 않는 모임입니다.\"}");
			}

			// ✅ 기존 정보 업데이트
			existingCircle.setCircleName(circleName);
			existingCircle.setCircleCategory(circleCategory);
			existingCircle.setCircleDate(circleDate);
			existingCircle.setCircleMaxMember(circleMaxMember);
			existingCircle.setCircleDetail(circleDetail);
			existingCircle.setCircleAddress(circleAddress);
			existingCircle.setCircleLat(circleLat);
			existingCircle.setCircleLng(circleLng);
			existingCircle.setCirclePlaceId(circlePlaceId);

			// ✅ 파일이 업로드되었을 때만 pictureUrl 변경 (기존 유지)
			if (file != null && !file.isEmpty()) {
			    String filePath = fileStorageService.storeFile(file);
			    if (filePath != null) {
			        existingCircle.setPictureUrl(filePath); // ✅ 새로운 이미지 저장
			    }
			}

			// ✅ DB 업데이트
			circleService.updateCircle(existingCircle);
			return ResponseEntity.ok("{\"message\": \"모임 정보가 수정되었습니다.\"}");

		} catch (Exception e) {
			return ResponseEntity.status(500).body("{\"message\": \"수정 실패: " + e.getMessage() + "\"}");
		}
	}

}
