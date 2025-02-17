package com.loco.aroundme.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.loco.aroundme.common.security.domain.CustomUser;
import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.domain.Users;
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
	public Circle findCircleById(int circleId) { // 기존 getCircleById에서 변경
		return circleMapper.findCircleById(circleId);
	}

	@Override
	public void updateCircle(Circle circle) {
		circleMapper.updateCircle(circle);
	}

	 @Override
	    public void attendCircle(int circleId, int userId) {
	        if (circleMapper.isUserAttending(circleId, userId) == 0) {
	            circleMapper.attendCircle(circleId, userId);
	        }
	    }

	    @Override
	    public void cancelAttendance(int circleId, int userId) {
	        circleMapper.cancelAttendance(circleId, userId);
	    }

	    @Override
	    public List<Users> getAttendeesByCircleId(int circleId) {
	        return circleMapper.getAttendeesByCircleId(circleId);
	    }

	    @Override
	    public boolean isUserAttending(int circleId, int userId) {
	        return circleMapper.isUserAttending(circleId, userId) > 0;
	    }
	
}