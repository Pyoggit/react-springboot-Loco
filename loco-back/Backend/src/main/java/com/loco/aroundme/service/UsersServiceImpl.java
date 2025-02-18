package com.loco.aroundme.service;

import java.io.File;
import java.io.IOException;
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
	            uploadProfileImage(user, profileImage);
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


	@Override
	public Users read(String email) {
		if (email == null || email.trim().isEmpty()) {
			throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
		}
		return usersMapper.read(email);
	}

	@Override
	@Transactional
	public void updateUser(Users user, MultipartFile profileImage) {
	    if (user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
	        throw new IllegalArgumentException("🚨 userEmail이 null이므로 업데이트할 수 없습니다!");
	    }

	    try {
	        log.info("🔄 업데이트 진행: {}", user.getUserEmail());

	        // ✅ 기존 데이터 유지하면서 필요한 부분만 업데이트
	        Users existingUser = usersMapper.read(user.getUserEmail());
	        if (existingUser == null) {
	            throw new IllegalArgumentException("해당 이메일의 사용자가 존재하지 않습니다.");
	        }

	        existingUser.setUserName(user.getUserName());
	        existingUser.setGender(user.getGender());
	        existingUser.setMobile1(user.getMobile1());
	        existingUser.setMobile2(user.getMobile2());
	        existingUser.setMobile3(user.getMobile3());
	        existingUser.setPhone1(user.getPhone1());
	        existingUser.setPhone2(user.getPhone2());
	        existingUser.setPhone3(user.getPhone3());
	        existingUser.setZipcode(user.getZipcode());
	        existingUser.setAddress1(user.getAddress1());
	        existingUser.setAddress2(user.getAddress2());

	        // ✅ 프로필 이미지 처리
	        if (profileImage != null && !profileImage.isEmpty()) {
	            uploadProfileImage(existingUser, profileImage);
	        }

	        usersMapper.updateUser(existingUser);
	        log.info("✅ 회원 정보 업데이트 완료: {}", user.getUserEmail());
	    } catch (Exception e) {
	        log.error("❌ 회원 정보 업데이트 중 오류 발생", e);
	        throw new RuntimeException("회원정보 업데이트 중 오류가 발생했습니다.");
	    }
	}


	
	// ✅ 프로필 이미지 업로드 및 저장된 파일명 반환
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

        String uniqueFileName = UUID.randomUUID().toString() + extension;
        File file = new File(UPLOAD_DIR + uniqueFileName);
        profileImage.transferTo(file);

        user.setOriginUser(originalFilename);
        user.setSysUser(uniqueFileName);

        return uniqueFileName;
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

	    String mobile1 = mobile.substring(0, 3);  // 010
	    String mobile2 = mobile.substring(3, 7);  // 중간 4자리
	    String mobile3 = mobile.substring(7);     // 끝 4자리

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
        String tempPassword = generateRandomPassword();
        String encryptedPassword = passwordEncoder.encode(tempPassword);

        Users user = usersMapper.read(email);
        if (user != null) {
            user.setPassword(encryptedPassword);
            usersMapper.updateUser(user);
        }

        return tempPassword;
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
