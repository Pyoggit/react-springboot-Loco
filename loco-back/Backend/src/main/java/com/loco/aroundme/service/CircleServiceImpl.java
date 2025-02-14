package com.loco.aroundme.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.mapper.CircleMapper;

@Service
public class CircleServiceImpl implements CircleService {

	private final CircleFileStorageService circleFileStorageService;

	public CircleServiceImpl(CircleMapper circleMapper, CircleFileStorageService circleFileStorageService) {
		this.circleMapper = circleMapper;
		this.circleFileStorageService = circleFileStorageService;
	}

	@Autowired
	private CircleMapper circleMapper; // ✅ `@Autowired` 사용하여 주입

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

	@Override
	public void deleteCircle(Long circleId) {
		circleMapper.deleteCircle(circleId);
	}

	@Override
	public boolean attendCircle(Long circleId) {
		Circle circle = circleMapper.getCircleById(circleId);

		if (circle == null) {
			throw new IllegalArgumentException("존재하지 않는 모임입니다.");
		}

		if (circle.getCircleMember() >= circle.getCircleMaxMember()) {
			throw new IllegalStateException("모임 정원이 초과되었습니다.");
		}

		circleMapper.updateMemberCount(circleId); // ✅ 참석 인원 증가
		return true;
	}

	@Override
	public Circle findCircleById(int circleId) { // 기존 getCircleById에서 변경
		return circleMapper.findCircleById(circleId);
	}

	@Override
	public void updateCircle(Circle circle) {
		circleMapper.updateCircle(circle);
	}

}