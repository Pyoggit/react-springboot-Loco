package com.loco.aroundme.service;

import java.util.Optional;

import org.apache.ibatis.annotations.Param;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Users;

//@Mapper
//public interface UsersService {
//    Users read(@Param("userEmail") String userEmail);
//
//    void registerUser(Users user, MultipartFile profileImage) throws Exception;
//
//    void updateUser(Users user, MultipartFile profileImage) throws Exception;
//
//    void updateUser(Users user) throws Exception;
//
//    void resignKakaoUser(Users user) throws Exception;
//
//    // ✅ 프로필 이미지 업로드 시 `Users` 객체도 전달 가능하도록 수정!
//    String uploadProfileImage(Users user, MultipartFile profileImage) throws Exception;
//    
// // ✅ 회원 탈퇴 메서드 추가
//    void deleteUser(String userEmail) throws Exception;
//
//}
public interface UsersService {
	Users read(@Param("userEmail") String userEmail);

	void resignKakaoUser(Users user) throws Exception;

	void registerUser(Users user, MultipartFile profileImage) throws Exception;

	void updateUser(Users user, MultipartFile profileImage) throws Exception;

	void updateUser(Users user) throws Exception;

	void deleteUser(String userEmail) throws Exception;

	Users findByEmail(String email);

	Optional<String> findEmailByNameAndMobile(String name, String mobile);

	boolean existsByNameAndEmail(String name, String email);

	boolean existsByEmail(String email);

	String generateTemporaryPassword(String email);

	String uploadProfileImage(Users user, MultipartFile profileImage) throws Exception;
}