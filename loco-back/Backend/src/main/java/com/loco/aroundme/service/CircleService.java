package com.loco.aroundme.service;

import java.util.List;
import java.util.Map;

import com.loco.aroundme.domain.Circle;

public interface CircleService {
	List<Circle> getCirclesByDate(String date);

	List<Circle> getAllCircles();

	Circle createCircle(Circle circle);

	void deleteCircle(Long circleId);

	boolean attendCircle(Long circleId);

	Circle findCircleById(int circleId); // 기존 getCircleById에서 변경

	void updateCircle(Circle circle);
}
