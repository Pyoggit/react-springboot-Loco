package com.loco.aroundme.mapper;

import org.apache.ibatis.annotations.Mapper;

import com.loco.aroundme.domain.KakaoUsers;

@Mapper
public interface KakaoUsersMapper {
	KakaoUsers findByKakaoId(String kakaoId);

	void insertKakaoUser(KakaoUsers kakaoUsers);
}
