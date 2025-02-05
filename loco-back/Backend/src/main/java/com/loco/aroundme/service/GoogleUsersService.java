package com.loco.aroundme.service;

import com.loco.aroundme.domain.GoogleUsers;

public interface GoogleUsersService {
	public GoogleUsers findByGoogleId(String googleId);

	public void registerGoogleUser(GoogleUsers googleUsers);
}
