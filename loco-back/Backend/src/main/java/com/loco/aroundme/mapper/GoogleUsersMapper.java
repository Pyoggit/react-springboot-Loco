package com.loco.aroundme.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.loco.aroundme.domain.GoogleUsers;

@Mapper
public interface GoogleUsersMapper {
	GoogleUsers findByGoogleId(String googleId);

	void insertGoogleUser(GoogleUsers googleUsers);
}
