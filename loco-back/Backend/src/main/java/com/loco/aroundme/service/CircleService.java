package com.loco.aroundme.service;

import java.util.List;
import java.util.Map;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;

import com.loco.aroundme.common.security.domain.CustomUser;
import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.domain.Users;

public interface CircleService {
	List<Circle> getCirclesByDate(String date);

	List<Circle> getAllCircles();

	Circle createCircle(Circle circle);

	void deleteCircle(Long circleId);

	Circle findCircleById(int circleId); // 기존 getCircleById에서 변경

	void updateCircle(Circle circle);

	void attendCircle(int circleId, int userId);

	void cancelAttendance(int circleId, int userId);

	List<Users> getAttendeesByCircleId(int circleId);

	boolean isUserAttending(int circleId, int userId);

	List<Circle> getCirclesByCategory(String category);

	List<Circle> searchCircles(String clubTitle, String city, String district, String category, String startDate);

}