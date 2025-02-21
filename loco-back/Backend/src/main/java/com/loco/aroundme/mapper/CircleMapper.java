package com.loco.aroundme.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
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

	@Select("SELECT C.*, U.USER_NAME AS creatorName, U.USER_EMAIL AS creatorEmail "
			+ "FROM CIRCLE C JOIN USERS U ON C.USER_ID = U.USER_ID")
	@Results({ @Result(property = "creatorName", column = "creatorName"),
			@Result(property = "creatorEmail", column = "creatorEmail") })
	List<Circle> adminFindAllCircles(); // ✅ 메서드 이름 수정

	/* 새로운 모임 추가 */
	void insertCircle(Circle circle);

	void deleteCircle(Long circleId);

	void updateMemberCount(@Param("circleId") Long circleId);

	// 조회
	@Select("SELECT C.*, U.USER_ID AS createdById FROM CIRCLE C " + "JOIN USERS U ON C.USER_ID = U.USER_ID "
			+ "WHERE C.CIRCLE_ID = #{circleId}")
	@Results({ @Result(property = "createdById", column = "createdById") // ✅ 추가된 부분
	})
	Circle findCircleById(@Param("circleId") int circleId);

	void updateCircle(@Param("circleId") Long circleId, @Param("circleName") String circleName,
			@Param("circleCategory") String circleCategory, @Param("circleDate") String circleDate,
			@Param("circleMaxMember") int circleMaxMember, @Param("circleDetail") String circleDetail,
			@Param("circleAddress") String circleAddress, @Param("circleLat") double circleLat,
			@Param("circleLng") double circleLng, @Param("circlePlaceId") String circlePlaceId,
			@Param("pictureUrl") String pictureUrl // ✅ 새 이미지 URL 추가
	); // XML에서 구현

	/* ✅ 모임 생성자의 이메일 가져오기 */
	@Select("SELECT U.USER_EMAIL FROM USERS U JOIN CIRCLE C ON U.USER_ID = C.USER_ID WHERE C.CIRCLE_ID = #{circleId}")
	String getCreatorEmailByCircleId(@Param("circleId") int circleId);

	/** ✅ 모임 참석 */
	@Insert("INSERT INTO ENJOY (ENJOY_ID, CIRCLE_ID, USER_ID) "
			+ "SELECT ENJOY_SEQ.NEXTVAL, #{circleId}, #{userId} FROM USERS WHERE USER_ID = #{userId}")
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

	/** ✅ 카테고리별 모임 정보 검색 */
	@Select("SELECT * FROM CIRCLE WHERE CIRCLE_CATEGORY = #{category} ORDER BY CIRCLE_DATE DESC")
	List<Circle> findCirclesByCategory(@Param("category") String category);

	/** ✅ 모임 검색 기능 (제목, 지역, 카테고리, 날짜) */
	@Select({ "<script>", "SELECT * FROM CIRCLE WHERE 1=1", "<if test='clubTitle != null and clubTitle != \"\"'>",
			" AND LOWER(CIRCLE_NAME) LIKE '%' || LOWER(#{clubTitle}) || '%'", "</if>",
			"<if test='city != null and city != \"\"'>", " AND CIRCLE_ADDRESS LIKE '%' || #{city} || '%'", "</if>",
			"<if test='district != null and district != \"\"'>", " AND CIRCLE_ADDRESS LIKE '%' || #{district} || '%'",
			"</if>", "<if test='category != null and category != \"\" and category != \"all\"'>",
			" AND CIRCLE_CATEGORY = #{category}", "</if>", "<if test='startDate != null and startDate != \"\"'>",
			" AND TO_CHAR(CIRCLE_DATE, 'YYYY-MM-DD') >= #{startDate}", "</if>", "ORDER BY CIRCLE_DATE DESC",
			"</script>" })
	List<Circle> searchCircles(@Param("clubTitle") String clubTitle, @Param("city") String city,
			@Param("district") String district, @Param("category") String category,
			@Param("startDate") String startDate);

	@Select("SELECT C.* FROM CIRCLE C JOIN ENJOY E ON C.CIRCLE_ID = E.CIRCLE_ID WHERE E.USER_ID = #{userId}")
	List<Circle> findAttendingCircles(@Param("userId") Long userId);

	@Select("SELECT C.* FROM CIRCLE C JOIN ENJOY E ON C.CIRCLE_ID = E.CIRCLE_ID WHERE E.USER_ID = #{userId}")
	List<Circle> findAttendingCirclesByUserId(@Param("userId") Long userId);

	@Select("SELECT * FROM CIRCLE WHERE TO_CHAR(CIRCLE_DATE, 'YYYY-MM-DD') = #{date} AND CIRCLE_CATEGORY = #{category} ORDER BY CIRCLE_DATE DESC")
	List<Circle> findCirclesByDateAndCategory(@Param("date") String date, @Param("category") String category);

	 // ✅ 1. 좋아요 추가
    @Insert("INSERT INTO CIRCLE_LIKES (USER_ID, CIRCLE_ID) VALUES (#{userId}, #{circleId})")
    void addLike(@Param("userId") int userId, @Param("circleId") int circleId);

    // ✅ 2. 좋아요 삭제
    @Delete("DELETE FROM CIRCLE_LIKES WHERE USER_ID = #{userId} AND CIRCLE_ID = #{circleId}")
    void removeLike(@Param("userId") int userId, @Param("circleId") int circleId);

    // ✅ 3. 특정 모임의 좋아요 개수 가져오기
    @Select("SELECT COUNT(*) FROM CIRCLE_LIKES WHERE CIRCLE_ID = #{circleId}")
    int getLikeCount(@Param("circleId") int circleId);

    // ✅ 4. 사용자가 특정 모임을 좋아요 눌렀는지 확인
    @Select("SELECT COUNT(*) FROM CIRCLE_LIKES WHERE USER_ID = #{userId} AND CIRCLE_ID = #{circleId}")
    int isUserLiked(@Param("userId") int userId, @Param("circleId") int circleId);

    // ✅ 5. 사용자가 좋아요한 모든 모임 조회
    @Select("SELECT C.* FROM CIRCLE_LIKES CL JOIN CIRCLE C ON CL.CIRCLE_ID = C.CIRCLE_ID WHERE CL.USER_ID = #{userId}")
    List<Circle> getLikedCirclesByUser(@Param("userId") int userId);

	void increaseLikeCount(int circleId);

	void decreaseLikeCount(int circleId);
	
	/** ✅ 사용자가 좋아요한 모임 목록 조회 */
    @Select("SELECT C.* FROM CIRCLE C JOIN CIRCLE_LIKES CL ON C.CIRCLE_ID = CL.CIRCLE_ID WHERE CL.USER_ID = #{userId}")
    List<Circle> getLikedCirclesByUserId(@Param("userId") Long userId);
}