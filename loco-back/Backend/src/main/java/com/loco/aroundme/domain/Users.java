package com.loco.aroundme.domain;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users {
	private Long userId;
	private String userEmail;
	private String password;
	private Long roleId;
	private String userName;
	private String gender;
	private String mobile1;
	private String mobile2;
	private String mobile3;
	private String phone1;
	private String phone2;
	private String phone3;
	private String birth;
	private String zipcode;
	private String address1;
	private String address2;
	private Date userRegDate;
	private String originUser;
	private String sysUser;

//	private List<Role> roleList;
}
