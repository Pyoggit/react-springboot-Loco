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
public class GoogleUsers {
	private String googleId;
	private String userEmail;
	private String userName;
	private String sysFile;
	private String originFile;
	private Long roleId;
	private Date userRegDate;
}
