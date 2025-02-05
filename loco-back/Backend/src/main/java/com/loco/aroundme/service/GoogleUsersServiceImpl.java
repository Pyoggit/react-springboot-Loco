package com.loco.aroundme.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.loco.aroundme.domain.GoogleUsers;
import com.loco.aroundme.mapper.GoogleUsersMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GoogleUsersServiceImpl implements GoogleUsersService {

	private final GoogleUsersMapper googleUsersMapper;

	@Override
	public GoogleUsers findByGoogleId(String googleId) {
		return googleUsersMapper.findByGoogleId(googleId);
	}

	@Override
	@Transactional
	public void registerGoogleUser(GoogleUsers googleUsers) {
		googleUsersMapper.insertGoogleUser(googleUsers);
	}
}
