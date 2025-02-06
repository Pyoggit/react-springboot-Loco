package com.loco.aroundme.service;

import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Users;

public interface UsersService {
	void registerUser(Users user, MultipartFile profileImage) throws Exception; // JSON 대신 Users 객체 받음

	Users findByEmail(String email);
}
