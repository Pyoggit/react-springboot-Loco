package com.loco.aroundme.mapper;

import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.loco.aroundme.domain.Users;

@Mapper
public interface UsersMapper {
//	List<Users> list();

	void insertUser(Users user) throws Exception;

//	Users detail(Long userId);

//	void update(Users user);

//	void delete(Long userId);

	 Users read(String username);
}
