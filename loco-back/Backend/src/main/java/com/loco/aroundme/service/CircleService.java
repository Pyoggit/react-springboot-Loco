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

	void updateCircle(Long circleId, String circleName, String circleCategory, String circleDate, int circleMaxMember,
			String circleDetail, String circleAddress, double circleLat, double circleLng, String circlePlaceId,
			String pictureUrl // ✅ 새 이미지 URL 업데이트
	);

	void attendCircle(int circleId, int userId);

	void cancelAttendance(int circleId, int userId);

	List<Users> getAttendeesByCircleId(int circleId);

	boolean isUserAttending(int circleId, int userId);

	List<Circle> getCirclesByCategory(String category);

	List<Circle> searchCircles(String clubTitle, String city, String district, String category, String startDate);

	String getCreatorEmailByCircleId(int circleId);

	Circle getCircleById(int circleId); // ✅ 모임 상세 조회 메서드 추가

	List<Circle> getAllCirclesForAdmin(); // ✅ 모든 모임 리스트 조회
	
	List<Circle> getAttendingCircles(Long userId);//마이페이지
	
	List<Circle> getCirclesByDateAndCategory(String date, String category);
}
