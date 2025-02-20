package com.loco.aroundme.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
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
	public ResponseEntity<?> createCircle(
	        @RequestPart("circleData") String circleDataJson,
	        @RequestPart(value = "file", required = false) MultipartFile file) {

	    try {
	        System.out.println("📌 받은 JSON 데이터: " + circleDataJson);  // ✅ JSON 데이터 확인

	        ObjectMapper objectMapper = new ObjectMapper();
	        Circle circle = objectMapper.readValue(circleDataJson, Circle.class);

	        System.out.println("✅ 변환된 Circle 객체: " + circle);

	        // ✅ 날짜 변환 적용
	        if (circle.getCircleDate() != null) {
	            String cleanedDate = circle.getCircleDate().replace(".0", "").trim();
	            circle.setCircleDate(cleanedDate);
	        }

	        // ✅ 파일 저장 처리
	        if (file != null && !file.isEmpty()) {
	            String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + file.getOriginalFilename();
	            File saveFile = new File(UPLOAD_DIR + fileName);
	            file.transferTo(saveFile);

	            // ✅ 저장된 파일 경로를 DB에 저장
	            circle.setPictureId(fileName);
	            circle.setPictureUrl("/upload/" + fileName);
	        }

	        System.out.println("✅ 최종 저장할 Circle 데이터: " + circle);

	        circleService.createCircle(circle);  // ✅ 여기서 예외 발생 가능
	        return ResponseEntity.ok().body("{\"message\": \"모임이 성공적으로 생성되었습니다.\"}");
	    } catch (Exception e) {
	        System.err.println("❌ 모임 생성 실패: " + e.getMessage());
	        return ResponseEntity.status(500).body("{\"message\": \"모임 생성 실패: " + e.getMessage() + "\"}");
	    }
	}

	/** ✅ 2. 이미지 접근 허용 (Spring MVC) */
	  @PostMapping("/upload")
	    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
	        try {
	            // ✅ 업로드 폴더 확인 및 생성
	            File uploadFolder = new File(UPLOAD_DIR);
	            if (!uploadFolder.exists()) {
	                uploadFolder.mkdirs();
	            }

	            // ✅ 파일 저장
	            String fileName = UUID.randomUUID().toString().replace("-", "") + "_" + file.getOriginalFilename();
	            File saveFile = new File(UPLOAD_DIR + fileName);
	            file.transferTo(saveFile);

	            // ✅ 반환할 JSON (pictureId, pictureUrl 포함)
	            Map<String, Object> response = new HashMap<>();
	            response.put("message", "파일 업로드 성공");
	            response.put("pictureId", fileName);
	            response.put("pictureUrl", "/upload/" + fileName);

	            return ResponseEntity.ok(response);
	        } catch (IOException e) {
	            return ResponseEntity.status(500).body("{\"message\": \"파일 업로드 실패: " + e.getMessage() + "\"}");
	        }
	    }

	  @GetMapping("/upload/{filename}")
	  public ResponseEntity<Resource> getImage(@PathVariable String filename) {
	      try {
	          Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
	          Resource resource = new UrlResource(filePath.toUri());

	          if (!resource.exists()) {
	              return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	          }

	          HttpHeaders headers = new HttpHeaders();
	          headers.add(HttpHeaders.CONTENT_TYPE, "image/jpeg");

	          return ResponseEntity.ok().headers(headers).body(resource);
	      } catch (Exception e) {
	          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
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
//수정 기능
	@PutMapping("/{circleId}")
	public ResponseEntity<?> updateCircle(
	    @PathVariable Long circleId,
	    @RequestParam("circleName") String circleName,
	    @RequestParam("circleCategory") String circleCategory,
	    @RequestParam("circleDate") String circleDate,
	    @RequestParam("circleMaxMember") int circleMaxMember,
	    @RequestParam("circleDetail") String circleDetail,
	    @RequestParam("circleAddress") String circleAddress,
	    @RequestParam("circleLat") double circleLat,
	    @RequestParam("circleLng") double circleLng,
	    @RequestParam("circlePlaceId") String circlePlaceId,
	    @RequestParam(value = "pictureId", required = false) String pictureId,
	    @RequestParam(value = "pictureUrl", required = false) String pictureUrl,
	    @RequestParam(value = "file", required = false) MultipartFile file
	) {
	    try {
	        System.out.println("📌 업데이트 요청 들어옴: circleId=" + circleId);

	        // ✅ 파일 저장 경로를 `C:/upload/`로 설정
	        String uploadDir = "C:/upload/";
	        File directory = new File(uploadDir);
	        if (!directory.exists()) {
	            directory.mkdirs();
	        }

	        // ✅ 기존 이미지 유지
	        String newPictureUrl = pictureUrl;

	        // ✅ 새로운 파일이 업로드된 경우 저장
	        if (file != null && !file.isEmpty()) {
	            System.out.println("📌 새 파일 업로드 중...");

	            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
	            File saveFile = new File(uploadDir + fileName);
	            file.transferTo(saveFile);

	            newPictureUrl = "/upload/" + fileName; // ✅ 새 이미지 URL 업데이트
	            System.out.println("✅ 파일 저장 완료: " + newPictureUrl);
	        }

	        // ✅ 모임 정보 업데이트
	        System.out.println("📌 DB 업데이트 실행...");
	        circleService.updateCircle(
	            circleId, circleName, circleCategory, circleDate, circleMaxMember, 
	            circleDetail, circleAddress, circleLat, circleLng, circlePlaceId, newPictureUrl
	        );
	        System.out.println("✅ DB 업데이트 성공!");

	        // ✅ 프론트엔드에 최신 `pictureUrl` 반환
	        Map<String, Object> response = new HashMap<>();
	        response.put("message", "모임이 수정되었습니다.");
	        response.put("pictureUrl", newPictureUrl);

	        return ResponseEntity.ok().body(response);
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("수정 실패: " + e.getMessage());
	    }
	}
	
	
	
	/** ✅ 모임 생성자의 이메일 조회 API */
    @GetMapping("/{circleId}/creator-email")
    public ResponseEntity<String> getCreatorEmail(@PathVariable int circleId) {
        String email = circleService.getCreatorEmailByCircleId(circleId);
        if (email != null) {
            return ResponseEntity.ok(email);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("이메일을 찾을 수 없습니다.");
        }
    }
    /** ✅ 모임 참석 */
    @PostMapping("/{circleId}/attend")
    public ResponseEntity<?> attendCircle(@PathVariable int circleId, @RequestBody Map<String, Integer> requestData) {
        int userId = requestData.get("userId");
        circleService.attendCircle(circleId, userId);
        return ResponseEntity.ok("{\"message\": \"모임 참석 완료\"}");
    }

	/** ✅ 참석 취소 */
    @DeleteMapping("/{circleId}/cancel")
    public ResponseEntity<?> cancelAttendance(@PathVariable int circleId, @RequestBody Map<String, Object> requestBody) {
        if (!requestBody.containsKey("userId")) {
            return ResponseEntity.badRequest().body("{\"message\": \"사용자 ID가 필요합니다.\"}");
        }

        // 🔥 String으로 변환 후 Integer로 변환
        int userId = Integer.parseInt(requestBody.get("userId").toString());

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
	    @RequestParam("userId") int userId) {  // ✅ 헤더 대신 쿼리 파라미터로 받기
	  return ResponseEntity.ok(circleService.isUserAttending(circleId, userId));
	}

	/** ✅ 특정 모임 정보 조회 API */
	@GetMapping("/{circleId}")
	public ResponseEntity<Circle> getCircleDetail(@PathVariable int circleId) {
	    Circle circle = circleService.getCircleById(circleId);

	    if (circle != null) {
	        System.out.println("📌 모임 생성자 ID (백엔드 응답): " + circle.getCreatedById()); // ✅ 확인용 로그
	        return ResponseEntity.ok(circle);
	    } else {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
	    }
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
	public ResponseEntity<?> searchCircles(@RequestParam(required = false) String clubTitle,
			@RequestParam(required = false) String city, @RequestParam(required = false) String district,
			@RequestParam(required = false) String category, @RequestParam(required = false) String startDate) {
		try {
			System.out
					.println("🔍 검색 요청: 제목=" + clubTitle + ", 지역=" + city + ", 카테고리=" + category + ", 날짜=" + startDate);

			if (clubTitle == null)
				clubTitle = "";
			if (city == null)
				city = "";
			if (district == null)
				district = "";
			if (category == null || category.equals("all"))
				category = "";
			if (startDate == null)
				startDate = "";

			List<Circle> circles = circleService.searchCircles(clubTitle, city, district, category, startDate);

			// 🔥 검색 결과 로그 추가
			System.out.println("🔍 검색 결과: " + circles.size() + "개");

			return ResponseEntity.ok(circles);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("검색 중 오류 발생: " + e.getMessage());
		}
	}
	

  
    

    /** ✅ 특정 모임 삭제 (관리자 전용) */
    @DeleteMapping("/admin/{circleId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')") // 🔥 관리자만 삭제 가능
    public ResponseEntity<String> DeleteCircle(@PathVariable Long circleId) {
        circleService.deleteCircle(circleId);
        return ResponseEntity.ok("✅ 모임이 성공적으로 삭제되었습니다.");
    }
    
    
    /** ✅ 모든 모임 리스트 조회 (관리자 전용) */
    @GetMapping("/admin")
    public ResponseEntity<List<Circle>> getAllCirclesForAdmin() {
        List<Circle> circles = circleService.getAllCirclesForAdmin();
        return ResponseEntity.ok(circles);
    }

   
    
    
}
