package com.loco.aroundme.domain;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


//USER_ID NUMBER PRIMARY KEY,             -- 사용자 고유키 (PK)
//PROVIDER VARCHAR2(20),                  --(일반, 카카오, 구글)
//PROVIDER_ID VARCHAR2(50),               -- 소셜로그인 고유 ID
//USER_EMAIL VARCHAR2(80) UNIQUE,         -- 사용자 이메일 (로그인 ID, 유니크 제약조건)
//PASSWORD VARCHAR2(80) NOT NULL,         -- 사용자 비밀번호
//ROLE_ID NUMBER DEFAULT 2,               -- 사용자 역할 고유키 (FK)
//USER_NAME VARCHAR2(80) NOT NULL,        -- 사용자 이름
//GENDER VARCHAR2(20),                    -- 성별 
//MOBILE1 VARCHAR2(5) NOT NULL,           -- 휴대폰 앞자리
//MOBILE2 VARCHAR2(8) NOT NULL,           -- 휴대폰 중간자리
//MOBILE3 VARCHAR2(8) NOT NULL,           -- 휴대폰 끝자리
//PHONE1 VARCHAR2(5),                     -- 전화번호 앞자리 (선택)
//PHONE2 VARCHAR2(8),                     -- 전화번호 중간자리 (선택)
//PHONE3 VARCHAR2(8),                     -- 전화번호 끝자리 (선택)
//BIRTH VARCHAR2(30),                     -- 생년월일 (선택)
//ZIPCODE VARCHAR2(10) NOT NULL,          -- 우편번호
//ADDRESS1 VARCHAR2(255) NOT NULL,        -- 기본주소
//ADDRESS2 VARCHAR2(255),                 -- 상세주소 (선택)
//USER_REGDATE DATE DEFAULT SYSDATE,      -- 가입일자 (기본값: 현재시간)
//ORIGIN_USER VARCHAR2(100),              -- 프로필 원본 파일명
//SYS_USER VARCHAR2(100)                  -- 프로필 저장 파일명


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users {
	private Long userId;
	private String provider;
	private String providerId;
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
