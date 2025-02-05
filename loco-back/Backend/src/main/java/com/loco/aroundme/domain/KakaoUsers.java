package com.loco.aroundme.domain;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoUsers {
	private String kakaoId; 
	private String userEmail;
	private String userName;
	private String sysFile;
	private String originFile;
	private Long roleId;
	private Date userRegDate; 
	
	
	 public KakaoUsers(String kakaoId, String userEmail, String userName, String sysFile, String originFile, Long roleId) {
	        this.kakaoId = kakaoId;
	        this.userEmail = userEmail;
	        this.userName = userName;
	        this.sysFile = sysFile;
	        this.originFile = originFile;
	        this.roleId = roleId;
	        this.userRegDate = new Date(); 
	    }
}
