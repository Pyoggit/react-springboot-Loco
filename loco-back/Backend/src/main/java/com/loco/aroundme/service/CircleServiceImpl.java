package com.loco.aroundme.service;

import org.springframework.stereotype.Service;

import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.mapper.CircleMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CircleServiceImpl implements CircleService {

    private final CircleMapper circleMapper;

    @Override
    public void createCircle(Circle circle) {
        circleMapper.insertCircle(circle);
    }

    @Override
    public Circle getCircleById(Long circleId) {
        return circleMapper.findCircleById(circleId);
    }
}