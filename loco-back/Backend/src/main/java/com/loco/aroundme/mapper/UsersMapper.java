package com.loco.aroundme.mapper;

import com.loco.aroundme.domain.Users;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface UsersMapper {
    Users read(@Param("userEmail") String userEmail); // 이메일로 사용자 조회
    void insertUser(Users user); // 사용자 추가
    List<Users> findAllUsers(); // 모든 사용자 조회
}
