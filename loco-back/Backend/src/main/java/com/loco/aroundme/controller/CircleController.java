package com.loco.aroundme.controller;

import java.io.File;
import java.io.IOException;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.service.CircleFileStorageService;
import com.loco.aroundme.service.CircleService;

@RestController
@RequestMapping("/api/circles")
@CrossOrigin(origins = "http://localhost:5173") // React 개발 서버 허용
public class CircleController {

	private final CircleService circleService;
	private final CircleFileStorageService fileStorageService;
	private final String UPLOAD_DIR = "C:/upload/";

	@Autowired
	private JwtUtil JwtUtil; // 🔥 JWT 유틸 클래스 주입

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

	/** ✅ 1. 모임 생성 & 파일 업로드 */
	@PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<?> createCircleWithFile(@RequestParam(value = "file", required = false) MultipartFile file, // ✅
																														// 파일
																														// 필수
																														// 아님
			@RequestParam("circleName") String circleName, @RequestParam("circleCategory") String circleCategory,
			@RequestParam("circleDate") String circleDate, @RequestParam("circleMaxMember") int circleMaxMember,
			@RequestParam("circleDetail") String circleDetail, @RequestParam("circleAddress") String circleAddress,
			@RequestParam("circleLat") Double circleLat, @RequestParam("circleLng") Double circleLng,
			@RequestParam("circlePlaceId") String circlePlaceId) {
		try {
			String filePath = "/upload/default.png"; // ✅ 기본 이미지 설정

			// ✅ 1. 파일이 있을 경우 저장
			if (file != null && !file.isEmpty()) {
				File uploadDir = new File("C:/upload/");
				if (!uploadDir.exists()) {
					uploadDir.mkdirs();
				}

				String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
				File saveFile = new File("C:/upload/" + fileName);
				file.transferTo(saveFile);
				filePath = "/upload/" + fileName; // ✅ 저장된 이미지 경로
			}

			// ✅ 2. 모임 정보 저장
			Circle newCircle = new Circle();
			newCircle.setCircleName(circleName);
			newCircle.setCircleCategory(circleCategory);
			newCircle.setCircleDate(circleDate);
			newCircle.setCircleMaxMember(circleMaxMember);
			newCircle.setCircleDetail(circleDetail);
			newCircle.setCircleAddress(circleAddress);
			newCircle.setCircleLat(circleLat);
			newCircle.setCircleLng(circleLng);
			newCircle.setCirclePlaceId(circlePlaceId);
			newCircle.setPictureUrl(filePath); // ✅ 변경된 이미지 경로 저장

			circleService.createCircle(newCircle);

			return ResponseEntity.ok().body(
					"{\"message\": \"모임이 성공적으로 생성되었습니다.\", \"imagePath\": \"" + newCircle.getPictureUrl() + "\"}");
		} catch (IOException e) {
			return ResponseEntity.status(500).body("{\"message\": \"파일 저장 실패: " + e.getMessage() + "\"}");
		}
	}

	/** ✅ 2. 이미지 접근 허용 (Spring MVC) */
	@GetMapping("/upload/{filename:.+}")
	public ResponseEntity<?> serveFile(@PathVariable String filename) {
		File file = new File(UPLOAD_DIR + filename);
		if (!file.exists()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("파일을 찾을 수 없습니다.");
		}
		return ResponseEntity.ok(file);
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

	/** ✅ 모임 참석 */
	@PostMapping("/{circleId}/attend")
	public ResponseEntity<?> attendCircle(@PathVariable int circleId, @RequestHeader("Authorization") String token) {
		int userId = JwtUtil.getUserIdFromToken(token); // JWT에서 유저 ID 추출
		circleService.attendCircle(circleId, userId);
		return ResponseEntity.ok("{\"message\": \"모임 참석 완료\"}");
	}

	/** ✅ 참석 취소 */
	@DeleteMapping("/{circleId}/cancel")
	public ResponseEntity<?> cancelAttendance(@PathVariable int circleId,
			@RequestHeader("Authorization") String token) {
		int userId = JwtUtil.getUserIdFromToken(token);
		circleService.cancelAttendance(circleId, userId);
		return ResponseEntity.ok("{\"message\": \"모임 참석 취소\"}");
	}

	/** ✅ 특정 모임에 참석한 사람들 조회 */
	@GetMapping("/{circleId}/attendees")
	public ResponseEntity<List<Users>> getAttendees(@PathVariable int circleId) {
		return ResponseEntity.ok(circleService.getAttendeesByCircleId(circleId));
	}

	/** ✅ 사용자의 참석 여부 확인 */
	@GetMapping("/{circleId}/isAttending")
	public ResponseEntity<Boolean> isUserAttending(@PathVariable int circleId,
			@RequestHeader("Authorization") String token) {
		int userId = JwtUtil.getUserIdFromToken(token);
		return ResponseEntity.ok(circleService.isUserAttending(circleId, userId));
	}
	
	/** ✅ 카테고리별 모임 리스트 반환 */
	@GetMapping("/category")
	public ResponseEntity<?> getCirclesByCategory(@RequestParam(required = false) String category) {
	    try {
	        System.out.println("📌 요청된 카테고리: " + category); // ✅ 요청된 카테고리 확인
	        List<Circle> circles;
	        
	        if (category == null || category.isEmpty() || category.equals("전체")) {
	            circles = circleService.getAllCircles(); 
	        } else {
	            circles = circleService.getCirclesByCategory(category);
	        }

	        // ✅ 응답 데이터 확인 로그
	        System.out.println("📥 필터링된 모임 개수: " + circles.size());

	        return ResponseEntity.ok(circles);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("모임 데이터를 불러오는 중 오류 발생: " + e.getMessage());
	    }
	}
	// 검색조회 기능
	@GetMapping("/search")
	public ResponseEntity<?> searchCircles(
	        @RequestParam(required = false) String clubTitle,
	        @RequestParam(required = false) String city,
	        @RequestParam(required = false) String district,
	        @RequestParam(required = false) String category,
	        @RequestParam(required = false) String startDate) {
	    try {
	        System.out.println("🔍 검색 요청: 제목=" + clubTitle + ", 지역=" + city + ", 카테고리=" + category + ", 날짜=" + startDate);

	        if (clubTitle == null) clubTitle = "";
	        if (city == null) city = "";
	        if (district == null) district = "";
	        if (category == null || category.equals("all")) category = "";
	        if (startDate == null) startDate = "";

	        List<Circle> circles = circleService.searchCircles(clubTitle, city, district, category, startDate);
	        
	        // 🔥 검색 결과 로그 추가
	        System.out.println("🔍 검색 결과: " + circles.size() + "개");

	        return ResponseEntity.ok(circles);
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body("검색 중 오류 발생: " + e.getMessage());
	    }
	}

}
