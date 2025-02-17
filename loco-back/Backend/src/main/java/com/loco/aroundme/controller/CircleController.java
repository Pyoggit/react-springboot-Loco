package com.loco.aroundme.controller;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.service.CircleFileStorageService;
import com.loco.aroundme.service.CircleService;
import com.loco.aroundme.service.UsersService;

import io.jsonwebtoken.io.IOException;

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

	@Value("${upload.path}") // 업로드 경로를 설정 파일에서 가져오기
	private String uploadPath;

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

	  @PostMapping("/upload")
	    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) throws IllegalStateException, java.io.IOException {
	        try {
	            // ✅ 폴더가 없으면 생성
	            File uploadFolder = new File(uploadPath);
	            if (!uploadFolder.exists()) {
	                uploadFolder.mkdirs();
	            }

	            // ✅ 파일 저장
	            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
	            File saveFile = new File(uploadPath + "/" + fileName);
	            file.transferTo(saveFile);

	            return ResponseEntity.ok().body("{\"message\": \"파일 업로드 성공\", \"filePath\": \"/upload/" + fileName + "\"}");
	        } catch (IOException e) {
	            return ResponseEntity.status(500).body("{\"message\": \"파일 업로드 실패: " + e.getMessage() + "\"}");
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

}
