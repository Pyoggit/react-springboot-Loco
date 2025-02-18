package com.loco.aroundme.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.loco.aroundme.common.security.domain.CustomUser;
import com.loco.aroundme.domain.Circle;
import com.loco.aroundme.domain.Users;

@Mapper
public interface CircleMapper {
	/* 특정 날짜의 모임 조회 */
	List<Circle> findCirclesByDate(@Param("date") String date);

	/* 모든 모임 조회 */
	List<Circle> findAllCircles();

	/* 새로운 모임 추가 */
	void insertCircle(Circle circle);

	void deleteCircle(Long circleId);

	void updateMemberCount(@Param("circleId") Long circleId);

	@Select("SELECT * FROM CIRCLE WHERE CIRCLE_ID = #{circleId}")
	Circle getCircleById(Long circleId);

	void updateCircle(Circle circle); // XML에서 구현

	/** ✅ 특정 모임 조회 */
	@Select("SELECT * FROM CIRCLE WHERE CIRCLE_ID = #{circleId}")
	Circle findCircleById(@Param("circleId") int circleId);

	/** ✅ 모임 참석 */
	@Insert(" INSERT INTO ENJOY (ENJOY_ID, CIRCLE_ID, USER_ID) SELECT ENJOY_SEQ.NEXTVAL, #{circleId}, #{userId} FROM USERS WHERE USER_ID = #{userId}")
	void attendCircle(@Param("circleId") int circleId, @Param("userId") int userId);

	/** ✅ 모임 참석 취소 */
	@Delete("DELETE FROM ENJOY WHERE CIRCLE_ID = #{circleId} AND USER_ID = #{userId}")
	void cancelAttendance(@Param("circleId") int circleId, @Param("userId") int userId);

	/** ✅ 특정 모임에 참석한 유저 목록 조회 */
	@Select("SELECT U.USER_ID, U.USER_NAME FROM ENJOY E JOIN USERS U ON E.USER_ID = U.USER_ID WHERE E.CIRCLE_ID = #{circleId}")
	List<Users> getAttendeesByCircleId(@Param("circleId") int circleId);

	/** ✅ 사용자가 특정 모임에 참석했는지 확인 */
	@Select("SELECT COUNT(*) FROM ENJOY WHERE CIRCLE_ID = #{circleId} AND USER_ID = #{userId}")
	int isUserAttending(@Param("circleId") int circleId, @Param("userId") int userId);
	
	//카테고리별 모임 정보 검색
	@Select("SELECT * FROM CIRCLE WHERE CIRCLE_CATEGORY = #{category} ORDER BY CIRCLE_DATE DESC")
	List<Circle> findCirclesByCategory(@Param("category") String category);

	@Select({
	    "<script>",
	    "SELECT * FROM CIRCLE WHERE 1=1",
	    "<if test='clubTitle != null and clubTitle != \"\"'>",
	    " AND LOWER(CIRCLE_NAME) LIKE '%' || LOWER(#{clubTitle}) || '%'", 
	    "</if>",
	    "<if test='city != null and city != \"\"'>",
	    " AND CIRCLE_ADDRESS LIKE '%' || #{city} || '%'",
	    "</if>",
	    "<if test='district != null and district != \"\"'>",
	    " AND CIRCLE_ADDRESS LIKE '%' || #{district} || '%'",
	    "</if>",
	    "<if test='category != null and category != \"\" and category != \"all\"'>",
	    " AND CIRCLE_CATEGORY = #{category}",
	    "</if>",
	    "<if test='startDate != null and startDate != \"\"'>",
	    " AND TO_CHAR(CIRCLE_DATE, 'YYYY-MM-DD') >= #{startDate}",
	    "</if>",
	    "ORDER BY CIRCLE_DATE DESC",
	    "</script>"
	})
	List<Circle> searchCircles(@Param("clubTitle") String clubTitle, 
	                           @Param("city") String city, 
	                           @Param("district") String district, 
	                           @Param("category") String category, 
	                           @Param("startDate") String startDate);
	
}