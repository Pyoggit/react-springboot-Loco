package com.loco.aroundme.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.loco.aroundme.domain.Users;

@Mapper
public interface UsersMapper {
    // ✅ 이메일로 사용자 조회
    Users read(@Param("userEmail") String userEmail);

    // ✅ 사용자 추가
    void insertUser(Users user);

    // ✅ 사용자 정보 업데이트 (프로필 이미지까지 업데이트)
    void updateUser(Users user);

    // ✅ 카카오 사용자 회원가입 (카카오 ID 기반)
    void resignKakaoUser(Users user);

    // ✅ 모든 사용자 조회
    List<Users> findAllUsers();

    // ✅ 회원 삭제 메서드 추가
    void deleteUser(@Param("userEmail") String userEmail);

    // ✅ 이름과 휴대폰 번호로 이메일 찾기
    String findEmailByNameAndMobile(@Param("name") String name, 
                                    @Param("mobile1") String mobile1, 
                                    @Param("mobile2") String mobile2, 
                                    @Param("mobile3") String mobile3);

}