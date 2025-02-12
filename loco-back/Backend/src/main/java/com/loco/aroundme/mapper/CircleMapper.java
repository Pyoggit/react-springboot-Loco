package com.loco.aroundme.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;
import com.loco.aroundme.domain.Circle;

@Mapper
public interface CircleMapper {
	void insertCircle(Circle circle);
    Circle findCircleById(Long circleId);
}