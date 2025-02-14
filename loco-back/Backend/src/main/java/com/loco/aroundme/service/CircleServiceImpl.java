package com.loco.aroundme.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.mapper.CircleMapper;

@Service
public class CircleServiceImpl implements CircleService {

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
}