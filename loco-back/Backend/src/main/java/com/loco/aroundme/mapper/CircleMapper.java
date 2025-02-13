package com.loco.aroundme.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import java.util.List;
import java.util.Map;

import com.loco.aroundme.domain.Circle;

@Mapper
public interface CircleMapper {
	  /*특정 날짜의 모임 조회 */
    List<Circle> findCirclesByDate(@Param("date") String date);

    /*모든 모임 조회 */
    List<Circle> findAllCircles();

    /*새로운 모임 추가 */
    void insertCircle(Circle circle);
}