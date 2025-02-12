package com.loco.aroundme.service;

import java.util.List;

import com.loco.aroundme.domain.Circle;

public interface CircleService {
    void createCircle(Circle circle);
    Circle getCircleById(Long circleId);
}
