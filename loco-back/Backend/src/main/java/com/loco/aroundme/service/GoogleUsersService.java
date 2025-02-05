package com.loco.aroundme.service;

import com.loco.aroundme.domain.GoogleUsers;

public interface GoogleUsersService {
	GoogleUsers findByGoogleId(String googleId);

	void registerGoogleUser(GoogleUsers googleUsers);
}
