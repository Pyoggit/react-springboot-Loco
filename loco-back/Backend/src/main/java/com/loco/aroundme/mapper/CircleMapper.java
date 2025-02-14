package com.loco.aroundme.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.loco.aroundme.domain.Circle;

@Mapper
public interface CircleMapper {
	  /*특정 날짜의 모임 조회 */
    List<Circle> findCirclesByDate(@Param("date") String date);

    /*모든 모임 조회 */
    List<Circle> findAllCircles();

    /*새로운 모임 추가 */
    void insertCircle(Circle circle);
    
    void deleteCircle(Long circleId);
    
    void updateMemberCount(@Param("circleId") Long circleId);
    
    @Select("SELECT * FROM CIRCLE WHERE CIRCLE_ID = #{circleId}")
    Circle getCircleById(Long circleId);
    
   
    Circle findCircleById(int circleId); // 기존 getCircleById에서 변경

    void updateCircle(Circle circle); // XML에서 구현
}