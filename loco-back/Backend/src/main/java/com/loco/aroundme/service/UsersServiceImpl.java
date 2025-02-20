package com.loco.aroundme.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersServiceImpl implements UsersService {

//	void registerUser(Users user, MultipartFile profileImage) throws Exception; // JSON 대신 Users 객체 받음
//	Users findByEmail(String email);

	private final UsersMapper usersMapper;
	private final BCryptPasswordEncoder passwordEncoder;
	private static final String UPLOAD_DIR = "C:/upload/";
	private static final String BASE_IMAGE_URL = "http://localhost:8080/upload/"; // ✅ 기본 이미지 URL 설정
//	@Value("${file.upload.path}")
//	private String uploadPath; // ✅ 환경변수에서 값 로드

//	@Override
//	@Transactional
//	public void registerUser(Users user, MultipartFile profileImage) throws Exception {
//		if (user == null || user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
//			throw new IllegalArgumentException("User 정보가 유효하지 않습니다.");
//		}
//
//		if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
//			user.setPassword("1234"); // 기본비밀번호 설정
//		}
//		user.setPassword(passwordEncoder.encode(user.getPassword())); // 비밀번호 암호화
//
//		log.info("비밀번호 값 1: {}", user.getPassword());
//
//		if (user.getRoleId() == null) {
//			user.setRoleId(2L);
//		}
//		user.setUserRegDate(new Date());
//
//		// 카카오에서 받은 프로필 이미지가 있는 경우 처리
//		if (user.getOriginUser() == null || user.getOriginUser().isEmpty()) {
//			if (user.getSysUser() != null && !user.getSysUser().isEmpty()) {
//				user.setOriginUser(user.getSysUser()); // 카카오 이미지 URL 저장
//			} else {
//				user.setOriginUser("default-profile.png");
//			}
//		}
//
//		try {
//			if (profileImage != null && !profileImage.isEmpty()) {
//				String originalFilename = profileImage.getOriginalFilename();
//
//				// 파일명이 null이거나 확장자가 없는 경우 예외 처리
//				if (originalFilename == null || !originalFilename.contains(".")) {
//					throw new IllegalArgumentException("유효하지 않은 파일명입니다.");
//				}
//
//				// 확장자 추출
//				String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
//
//				// 허용된 확장자 목록
//				if (!isAllowedExtension(extension)) {
//					throw new IllegalArgumentException("허용되지 않은 파일 형식입니다.");
//				}
//
//				// 저장할 파일명 생성
//				String uniqueFileName = UUID.randomUUID().toString() + extension;
//
//				File file = new File(UPLOAD_DIR + uniqueFileName);
//				profileImage.transferTo(file);
//
//				user.setOriginUser(originalFilename);
//				user.setSysUser(uniqueFileName);
//			} else {
//				// 여기서 user.getOriginUser() 값이 있다면, 그대로 사용하도록 변경!
//				if (user.getOriginUser() == null || user.getOriginUser().isEmpty()) {
//					user.setOriginUser("default-profile.png");
//					user.setSysUser("default-profile.png");
//				}
//			}
//
//			usersMapper.insertUser(user);
//			log.info("사용자 저장 완료: {}, 프로필 이미지={}", user.getUserEmail(), user.getOriginUser());
//
//		} catch (IOException e) {
//			log.error("파일 업로드 중 오류 발생: {}", e.getMessage());
//			throw new RuntimeException("파일 업로드에 실패하였습니다.");
//		} catch (Exception e) {
//			log.error("회원가입 중 오류 발생: {}", e.getMessage());
//			throw new RuntimeException("회원가입 중 오류가 발생했습니다.");
//		}
//	}
//	@Override
//	@Transactional
//	public void registerUser(Users user, MultipartFile profileImage) throws Exception {
//	    try {
//	        if (user == null || user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
//	            throw new IllegalArgumentException("User 정보가 유효하지 않습니다.");
//	        }
//
//	        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
//	            user.setPassword("1234");
//	        }
//	        user.setPassword(passwordEncoder.encode(user.getPassword()));
//
//	        if (user.getRoleId() == null) {
//	            user.setRoleId(2L);
//	        }
//
//	        if (profileImage != null && !profileImage.isEmpty()) {
//	            user.setOriginUser(profileImage.getOriginalFilename()); // ✅ 원본 파일명 저장!
//	            uploadProfileImage(user, profileImage); // ✅ 업로드 실행
//	        } else {
//	            user.setOriginUser("default-image.png");
//	            user.setSysUser("default-image.png");
//	        }
//
//
//	        usersMapper.insertUser(user);
//	        log.info("✅ 사용자 저장 완료: {}, 프로필 이미지={}", user.getUserEmail(), user.getOriginUser());
//
//	    } catch (IllegalArgumentException e) {
//	        log.error("🚨 유효하지 않은 입력값: {}", e.getMessage());
//	        throw new IllegalArgumentException("입력값이 올바르지 않습니다: " + e.getMessage());
//	    } catch (IOException e) {
//	        log.error("🚨 파일 업로드 실패: {}", e.getMessage());
//	        throw new RuntimeException("파일 업로드 중 오류가 발생했습니다.");
//	    } catch (Exception e) {
//	        log.error("🚨 회원가입 중 알 수 없는 오류 발생: {}", e.getMessage());
//	        throw new RuntimeException("회원가입 처리 중 오류가 발생했습니다.");
//	    }
//	}@Override
	@Override
	@Transactional
	public void registerUser(Users user, MultipartFile profileImage) throws Exception {
		try {
			if (user == null || user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
				throw new IllegalArgumentException("User 정보가 유효하지 않습니다.");
			}

			if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
				user.setPassword("1234");
			}
			user.setPassword(passwordEncoder.encode(user.getPassword()));

			if (user.getRoleId() == null) {
				user.setRoleId(2L);
			}

			if (profileImage != null && !profileImage.isEmpty()) {
				String sysFileName = uploadProfileImage(user, profileImage); // ✅ 파일 업로드 후 파일명 반환 받기
				user.setSysUser(sysFileName); // ✅ 시스템 파일명 저장
			} else {
				user.setOriginUser("default-image.png");
				user.setSysUser("default-image.png");
			}

			usersMapper.insertUser(user);
			log.info("✅ 사용자 저장 완료: {}, 프로필 이미지={}", user.getUserEmail(), user.getOriginUser());

		} catch (IllegalArgumentException e) {
			log.error("🚨 유효하지 않은 입력값: {}", e.getMessage());
			throw new IllegalArgumentException("입력값이 올바르지 않습니다: " + e.getMessage());
		} catch (IOException e) {
			log.error("🚨 파일 업로드 실패: {}", e.getMessage());
			throw new RuntimeException("파일 업로드 중 오류가 발생했습니다.");
		} catch (Exception e) {
			log.error("🚨 회원가입 중 알 수 없는 오류 발생: {}", e.getMessage());
			throw new RuntimeException("회원가입 처리 중 오류가 발생했습니다.");
		}
	}


//	@Override
//	public Users read(String email) {
//		if (email == null || email.trim().isEmpty()) {
//			throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
//		}
//
//		Users user = usersMapper.read(email);
//
//		if (user != null) {
//			log.info("📌 가져온 유저 정보: {}", user);
//			log.info("📌 가져온 profileImage 값: {}", user.getSysUser());
//
//			if (user.getSysUser() != null && !user.getSysUser().isEmpty()) {
//				user.setSysUser(getProfileImageUrl(user.getSysUser())); // ✅ 프로필 이미지 URL 변환
//			} else {
//				user.setSysUser("http://localhost:8080/upload/default-profile.png"); // 기본 이미지
//			}
//		}
//
//		return user;
//	}
	@Override
	public Users read(String email) {
	    if (email == null || email.trim().isEmpty()) {
	        throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
	    }

	    Users user = usersMapper.read(email);

	    if (user != null) {
	        log.info("📌 가져온 유저 정보: {}", user);
	        log.info("📌 가져온 profileImage 값: {}", user.getSysUser());

	        // ✅ 카카오 사용자인 경우 원래 URL 그대로 사용
	        if (user.getSysUser() != null && user.getSysUser().startsWith("http")) {
	            user.setSysUser(user.getSysUser()); 
	        } else {
	            // ✅ 일반 사용자라면 `/upload/` 추가
	            user.setSysUser("http://localhost:8080/upload/" + user.getSysUser()); 
	        }
	    }

	    return user;
	}


	@Override
	@Transactional
	public void updateUser(Users user, MultipartFile profileImage) {
	    if (user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
	        throw new IllegalArgumentException("🚨 userEmail이 null이므로 업데이트할 수 없습니다!");
	    }

	    try {
	        log.info("🔄 업데이트 진행: {}", user.getUserEmail());

	        // ✅ 기존 유저 정보 가져오기
	        Users existingUser = usersMapper.read(user.getUserEmail());
	        if (existingUser == null) {
	            throw new IllegalArgumentException("해당 이메일의 사용자가 존재하지 않습니다.");
	        }

	        // ✅ 기존 정보 유지하면서 새로운 정보만 업데이트
	        existingUser.setUserName(user.getUserName());
	        existingUser.setGender(user.getGender());
	        existingUser.setBirth(user.getBirth());
	        existingUser.setMobile1(user.getMobile1());
	        existingUser.setMobile2(user.getMobile2());
	        existingUser.setMobile3(user.getMobile3());
	        existingUser.setPhone1(user.getPhone1());
	        existingUser.setPhone2(user.getPhone2());
	        existingUser.setPhone3(user.getPhone3());
	        existingUser.setZipcode(user.getZipcode());
	        existingUser.setAddress1(user.getAddress1());
	        existingUser.setAddress2(user.getAddress2());

	        // ✅ 프로필 이미지 업데이트
	        if (profileImage != null && !profileImage.isEmpty()) {
	            String newSysFileName = updateProfileImage(existingUser, profileImage);
	            existingUser.setSysUser(newSysFileName); // ✅ 새로운 파일명으로 업데이트
	        }

	        usersMapper.updateUser(existingUser);
	        log.info("✅ 회원 정보 업데이트 완료: {}", existingUser);

	    } catch (Exception e) {
	        log.error("❌ 회원 정보 업데이트 중 오류 발생", e);
	        throw new RuntimeException("회원정보 업데이트 중 오류가 발생했습니다.");
	    }
	}

	
	// 업데이트할때
	@Override
	public String updateProfileImage(Users user, MultipartFile profileImage) throws Exception {
	    if (profileImage == null || profileImage.isEmpty()) {
	        return user.getSysUser(); // 기존 파일명을 그대로 반환 (프로필 사진 변경 안 함)
	    }

	    // ✅ 기존 파일 삭제 (기본 이미지가 아닐 경우)
	    if (user.getSysUser() != null && !user.getSysUser().equals("default-image.png")) {
	        File existingFile = new File(UPLOAD_DIR + user.getSysUser());
	        if (existingFile.exists()) {
	            boolean deleted = existingFile.delete();
	            log.info("✅ 기존 파일 삭제됨: {} → 삭제 결과: {}", user.getSysUser(), deleted);
	        }
	    }

	    // ✅ 기존 sysUser 파일명을 유지
	    String uniqueFileName = user.getSysUser();
	    
	    if (uniqueFileName == null || uniqueFileName.isEmpty()) {
	        // 기존 파일명이 없으면 새로운 UUID 기반 파일명 생성
	        String extension = profileImage.getOriginalFilename()
	                                      .substring(profileImage.getOriginalFilename().lastIndexOf("."))
	                                      .toLowerCase();
	        uniqueFileName = UUID.randomUUID().toString() + extension;
	    }

	    // ✅ 파일 저장 경로 설정
	    File uploadDir = new File(UPLOAD_DIR);
	    if (!uploadDir.exists()) {
	        uploadDir.mkdirs();
	    }
	    Path filePath = Paths.get(UPLOAD_DIR, uniqueFileName);
	    profileImage.transferTo(filePath.toFile());

	    log.info("✅ 프로필 이미지 업데이트 완료: {}", filePath.toAbsolutePath());

	    return uniqueFileName; // ✅ 기존 파일명을 그대로 반환
	}



	// ✅ 프로필 이미지 업로드 및 저장된 파일명 반환
//	@Override
//    public String uploadProfileImage(Users user, MultipartFile profileImage) throws IOException {
//        if (profileImage == null || profileImage.isEmpty()) {
//            return null;
//        }
//
//        String originalFilename = profileImage.getOriginalFilename();
//        if (originalFilename == null || !originalFilename.contains(".")) {
//            throw new IllegalArgumentException("유효하지 않은 파일명입니다.");
//        }
//
//        String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
//        if (!isAllowedExtension(extension)) {
//            throw new IllegalArgumentException("허용되지 않은 파일 형식입니다.");
//        }
//
//        String uniqueFileName = UUID.randomUUID().toString() + extension;
//        File file = new File(UPLOAD_DIR + uniqueFileName);
//        profileImage.transferTo(file);
//
//        user.setOriginUser(originalFilename);
//        user.setSysUser(uniqueFileName);
//
//        return uniqueFileName;
//    }

	@Override
	public String uploadProfileImage(Users user, MultipartFile profileImage) throws IOException {
		if (profileImage == null || profileImage.isEmpty()) {
			return null;
		}

		String originalFilename = profileImage.getOriginalFilename();
		if (originalFilename == null || !originalFilename.contains(".")) {
			throw new IllegalArgumentException("유효하지 않은 파일명입니다.");
		}

		String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();
		if (!isAllowedExtension(extension)) {
			throw new IllegalArgumentException("허용되지 않은 파일 형식입니다.");
		}

		// ✅ 저장할 디렉토리 생성 (없으면 자동 생성)
		File uploadDir = new File(UPLOAD_DIR);
		if (!uploadDir.exists()) {
			uploadDir.mkdirs();
		}

		// ✅ 파일명 생성 (날짜 + UUID 조합으로 유니크하게)
		String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
		String uniqueFileName = timestamp + "_" + UUID.randomUUID().toString().substring(0, 8) + extension;

		// ✅ 파일 저장 경로 설정 (Path 객체 사용)
		Path filePath = Paths.get(UPLOAD_DIR, uniqueFileName);

		// ✅ 로그로 파일 경로 확인
		log.info("✅ 프로필 이미지 저장 위치: {}", filePath.toAbsolutePath());

		// ✅ 파일 저장 (Spring의 transferTo()를 사용)
		try {
			profileImage.transferTo(filePath.toFile());
		} catch (IOException e) {
			throw new RuntimeException("이미지 저장 중 오류 발생", e);
		}

		// ✅ DB에 저장할 원본 파일명과 시스템 파일명 설정
		user.setOriginUser(originalFilename); // 원본 파일명
		user.setSysUser(uniqueFileName); // 서버에 저장된 파일명

		return uniqueFileName; // 저장된 파일명 반환
	}

//    @Override
//    public Users getUserInfo(Long userId) {
//        Users user = usersMapper.readById(userId); // ✅ Get user from DB
//
//        if (user != null) {
//            user.setOriginUser(getProfileImageUrl(user.getSysUser())); // ✅ Set full image URL
//            log.info("유저정보{}", user);
//        }
//
//        return user;
//    }
	@Override
	public Users getUserInfo(Long userId) {
		Users user = usersMapper.readById(userId); // ✅ DB에서 유저 정보 가져오기

		if (user != null) {
			user.setOriginUser(getProfileImageUrl(user.getSysUser())); // ✅ 이미지 URL 설정
			log.info("유저정보{}", user);
		}

		return user;
	}

	// ✅ 프로필 이미지 URL 변환 메서드 추가
//    public String getProfileImageUrl(String profileImage) {
//        if (profileImage == null || profileImage.isEmpty()) {
//            return BASE_IMAGE_URL + "default-image.png"; // 기본 이미지 경로
//        }
//        return BASE_IMAGE_URL + profileImage; // 저장된 이미지의 URL
//    }
	// ✅ 프로필 이미지 URL 생성 메서드
	public String getProfileImageUrl(String profileImage) {
		if (profileImage == null || profileImage.isEmpty()) {
			return BASE_IMAGE_URL + "default-image.png"; // 기본 이미지 경로
		}
		return BASE_IMAGE_URL + profileImage; // 저장된 이미지의 URL
	}

	private boolean isAllowedExtension(String extension) {
		String[] allowedExtensions = { ".jpg", ".jpeg", ".png", ".gif" };
		for (String allowed : allowedExtensions) {
			if (extension.equals(allowed)) {
				return true;
			}
		}
		return false;
	}

	@PostMapping("/api/users/kakao/complete-register")
	public ResponseEntity<?> completeKakaoRegister(@RequestBody Users user) {
		try {
			log.info(" DB에 저장하기 전 비밀번호 값: {}", user.getPassword());
			usersMapper.updateUser(user);
			return ResponseEntity.ok(Map.of("message", "회원가입 완료"));
		} catch (Exception e) {
			log.error("회원가입 완료 처리 중 오류:", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "회원가입 중 오류 발생"));
		}
	}

//	@Override
//	@Transactional
//	public void updateUser(Users user) throws Exception {
//		if (user == null || user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
//			throw new IllegalArgumentException("Us er 정보가 유효하지 않습니다.");
//		}
//		log.info("비밀번호 값 확인2: {}", user.getPassword());
//
//		try {
//			usersMapper.updateUser(user);
//			log.info("사용자 정보 업데이트 완료: {}", user.getUserEmail());
//		} catch (Exception e) {
//			log.error(" 사용자 정보 업데이트 중 오류 발생: {}", e.getMessage());
//			throw new RuntimeException("사용자 정보 업데이트 중 오류가 발생했습니다.");
//		}
//	}

	@Override
	@Transactional
	public void resignKakaoUser(Users user) throws Exception {
		if (user == null || user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
			throw new IllegalArgumentException("User 정보가 유효하지 않습니다.");
		}

		// 비밀번호가 NULL인 경우 기본값 설정
		if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
			log.warn("⚠비밀번호가 NULL이므로 기본값 '1234' 설정");
			user.setPassword("1234");
		}

		// 비밀번호 암호화 후 다시 저장
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		log.info("비밀번호 값 확인 (암호화 후): {}", user.getPassword());

		if (user.getRoleId() == null) {
			user.setRoleId(2L);
		}

		if (user.getUserName() == null || user.getUserName().trim().isEmpty()) {
			throw new IllegalArgumentException("이름은 필수 입력 항목입니다.");
		}
		if (user.getGender() == null || user.getGender().trim().isEmpty()) {
			throw new IllegalArgumentException("⚠성별은 필수 입력 항목입니다.");
		}
		if (user.getBirth() == null) {
			throw new IllegalArgumentException("생년월일은 필수 입력 항목입니다.");
		}
		if (user.getZipcode() == null || user.getAddress1() == null || user.getAddress2() == null) {
			throw new IllegalArgumentException("⚠주소 정보는 필수 입력 항목입니다.");
		}

		log.info("DB 저장 직전 user 객체: {}", user);

		try {
			usersMapper.resignKakaoUser(user);
			log.info("카카오 회원가입 완료: {}", user.getUserEmail());
		} catch (Exception e) {
			log.error("카카오 회원가입 중 오류 발생: {}", e.getMessage());
			throw new RuntimeException("카카오 회원가입 중 오류가 발생했습니다.");
		}
	}

	@Override
	@Transactional
	public void deleteUser(String userEmail) throws Exception {
		if (userEmail == null || userEmail.trim().isEmpty()) {
			throw new IllegalArgumentException("🚨 이메일이 null이므로 삭제할 수 없습니다!");
		}

		try {
			log.info("🗑️ 회원 탈퇴 진행: {}", userEmail);

			Users existingUser = usersMapper.read(userEmail);
			if (existingUser == null) {
				throw new IllegalArgumentException("해당 이메일의 사용자가 존재하지 않습니다.");
			}

			usersMapper.deleteUser(userEmail);
			log.info("✅ 회원 탈퇴 완료: {}", userEmail);
		} catch (Exception e) {
			log.error("❌ 회원 탈퇴 중 오류 발생", e);
			throw new RuntimeException("회원 탈퇴 중 오류가 발생했습니다.");
		}
	}

	@Override
	public Users findByEmail(String email) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Optional<String> findEmailByNameAndMobile(String name, String mobile) {
		// ✅ 휴대폰 번호를 3개 필드로 나눠서 처리
		if (mobile.length() < 10) {
			return Optional.empty();
		}

		String mobile1 = mobile.substring(0, 3); // 010
		String mobile2 = mobile.substring(3, 7); // 중간 4자리
		String mobile3 = mobile.substring(7); // 끝 4자리

		// ✅ Mapper를 호출하여 이메일 조회
		return Optional.ofNullable(usersMapper.findEmailByNameAndMobile(name, mobile1, mobile2, mobile3));
	}

	@Override
	public boolean existsByNameAndEmail(String name, String email) {
		Users user = usersMapper.read(email);
		return user != null && user.getUserName().equals(name);
	}

	@Override
	public boolean existsByEmail(String email) {
		return usersMapper.read(email) != null;
	}

	@Override
	@Transactional
	public String generateTemporaryPassword(String email) {
		String tempPassword = UUID.randomUUID().toString().substring(0, 10); // 10자리 랜덤 비밀번호
		String encodedPassword = passwordEncoder.encode(tempPassword); // ✅ 비밀번호 암호화

		usersMapper.updatePassword(email, encodedPassword); // ✅ DB에 암호화된 비밀번호 저장
		return tempPassword; // 이메일로 보낼 평문 비밀번호 반환
	}

	private String generateRandomPassword() {
		String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
		StringBuilder sb = new StringBuilder();
		Random random = new Random();

		for (int i = 0; i < 10; i++) {
			sb.append(chars.charAt(random.nextInt(chars.length())));
		}

		return sb.toString();
	}

	@Override
	public void updateUser(Users user) throws Exception {
		// TODO Auto-generated method stub

	}

}
