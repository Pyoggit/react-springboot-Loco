package com.loco.aroundme.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.CircleMapper;

@Service
public class CircleServiceImpl implements CircleService {

	private final CircleMapper circleMapper;
	private final CircleFileStorageService circleFileStorageService;

	// ✅ 생성자 주입 방식으로 통일
	public CircleServiceImpl(CircleMapper circleMapper, CircleFileStorageService circleFileStorageService) {
		this.circleMapper = circleMapper;
		this.circleFileStorageService = circleFileStorageService;
	}

	/** ✅ 특정 날짜의 모임 조회 */
	@Override
	public List<Circle> getCirclesByDate(String date) {
		return circleMapper.findCirclesByDate(date);
	}

	/** ✅ 모든 모임 조회 */
	@Override
	public List<Circle> getAllCircles() {
		return circleMapper.findAllCircles();
	}

	/** ✅ 새로운 모임 저장 */
	@Override
	public Circle createCircle(Circle circle) {
		circleMapper.insertCircle(circle);
		return circle;
	}

	/** ✅ 모임 삭제 */
	@Override
	public void deleteCircle(Long circleId) {
		circleMapper.deleteCircle(circleId);
	}

	/** ✅ 모임 상세 조회 */
	@Override
	public Circle getCircleById(int circleId) {
		Circle circle = circleMapper.findCircleById(circleId);

		if (circle != null) {
			System.out.println("📌 모임 생성자 ID (백엔드): " + circle.getCreatedById()); // ✅ 확인용 로그
		}

		return circle;
	}

	/** ✅ 모임 정보 수정 */
	@Override
	public void updateCircle(Long circleId, String circleName, String circleCategory, String circleDate,
			int circleMaxMember, String circleDetail, String circleAddress, double circleLat, double circleLng,
			String circlePlaceId, String pictureUrl) {
		circleMapper.updateCircle(circleId, circleName, circleCategory, circleDate, circleMaxMember, circleDetail,
				circleAddress, circleLat, circleLng, circlePlaceId, pictureUrl);
	}

	/** ✅ 모임 참석 */
	@Override
	public void attendCircle(int circleId, int userId) {
		if (!isUserAttending(circleId, userId)) { // 🔥 이미 참석 여부를 확인하고 추가
			circleMapper.attendCircle(circleId, userId);
		}
	}

	/** ✅ 모임 참석 취소 */
	@Override
	public void cancelAttendance(int circleId, int userId) {
		circleMapper.cancelAttendance(circleId, userId);
	}

	/** ✅ 특정 모임의 참석자 목록 조회 */
	@Override
	public List<Users> getAttendeesByCircleId(int circleId) {
		return circleMapper.getAttendeesByCircleId(circleId);
	}

	/** ✅ 사용자의 참석 여부 확인 */
	@Override
	public boolean isUserAttending(int circleId, int userId) {
		return circleMapper.isUserAttending(circleId, userId) > 0;
	}

	/** ✅ 카테고리별 모임 조회 */
	@Override
	public List<Circle> getCirclesByCategory(String category) {
		System.out.println("🔎 데이터베이스에서 찾는 카테고리: " + category); // ✅ 로그 추가
		return circleMapper.findCirclesByCategory(category);
	}

	/** ✅ 모임 검색 기능 */
	@Override
	public List<Circle> searchCircles(String clubTitle, String city, String district, String category,
			String startDate) {
		return circleMapper.searchCircles(clubTitle != null ? clubTitle : "", city != null ? city : "",
				district != null ? district : "", (category != null && !category.equals("all")) ? category : "",
				startDate != null ? startDate : "");
	}

	/** ✅ 모임 생성자의 이메일 조회 */
	@Override
	public String getCreatorEmailByCircleId(int circleId) {
		return circleMapper.getCreatorEmailByCircleId(circleId);
	}

	@Override
	public Circle findCircleById(int circleId) {
		
		return circleMapper.findCircleById(circleId);
	}

	@Override
	public List<Circle> getAllCirclesForAdmin() {
		return circleMapper.adminFindAllCircles(); // ✅ 수정된 메서드 호출
	}

	@Override
	public List<Circle> getAttendingCircles(Long userId) {
		 return circleMapper.findAttendingCirclesByUserId(userId);
	}
}
