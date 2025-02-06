//package com.loco.aroundme.service;
//
//import java.util.Optional;
//
//import com.loco.aroundme.domain.KakaoUsers;
//
//public interface KakaoUsersService {
//	Optional<KakaoUsers> findByKakaoId(String kakaoId);
//
//	void registerKakaoUser(KakaoUsers kakaoUsers);
//}


package com.loco.aroundme.service;


import com.loco.aroundme.domain.KakaoUsers;

public interface KakaoUsersService {
	public KakaoUsers findByKakaoId(String kakaoId);

	public void registerKakaoUser(KakaoUsers kakaoUsers);
}
