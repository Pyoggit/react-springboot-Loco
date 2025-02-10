package com.loco.aroundme.service;

import java.io.File;
import java.util.Date;
import java.util.UUID;

import org.apache.ibatis.session.SqlSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersServiceImpl implements UsersService {

	private final UsersMapper usersMapper;
	private final BCryptPasswordEncoder passwordEncoder;
	private final SqlSession sqlSession; // MyBatis 세션 추가
	private static final String UPLOAD_DIR = "C:/upload/";

	@Override
	@Transactional
	public void registerUser(Users user, MultipartFile profileImage) throws Exception {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
//		user.setRoleId(2L);
		if(user.getRoleId() == null) {
			user.setRoleId(2L);
		}
		user.setUserRegDate(new Date());

		// 입력하지 않은 값은 null 처리
		user.setPhone1(user.getPhone1() == null || user.getPhone1().trim().isEmpty() ? null : user.getPhone1());
		user.setPhone2(user.getPhone2() == null || user.getPhone2().trim().isEmpty() ? null : user.getPhone2());
		user.setPhone3(user.getPhone3() == null || user.getPhone3().trim().isEmpty() ? null : user.getPhone3());
		user.setAddress2(user.getAddress2() == null || user.getAddress2().trim().isEmpty() ? null : user.getAddress2());

		if (profileImage != null && !profileImage.isEmpty()) {
			String originalFilename = profileImage.getOriginalFilename();
			String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
			String uniqueFileName = UUID.randomUUID().toString() + extension;

			File file = new File(UPLOAD_DIR + uniqueFileName);
			profileImage.transferTo(file);

			user.setOriginUser(originalFilename);
			user.setSysUser(uniqueFileName);
		} else {
			user.setOriginUser("default-profile.png");
			user.setSysUser("default-profile.png");
		}

		usersMapper.insertUser(user);
	}

	@Override
	public Users findByEmail(String email) {
		return usersMapper.read(email);
	}
}
