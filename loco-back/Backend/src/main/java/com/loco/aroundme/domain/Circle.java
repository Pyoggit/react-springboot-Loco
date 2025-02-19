package com.loco.aroundme.domain;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.Data;

@Data
public class Circle {
	 private int circleId;
	    private int userId;  // ✅ 모임 생성자 ID
	    private String createdByEmail; // ✅ 모임 생성자의 이메일
	    private String circleName;
	    private String circleCategory;
	    private String circleDate; // ✅ String 유지 (프론트에서 String으로 넘겨줌)
	    private int circleMaxMember; // ✅ 최대 참가 인원
	    private int circleMember; // ✅ 현재 참가 인원
	    private String circleDetail;
	    private String circleAddress;
	    private Double circleLat;
	    private Double circleLng;
	    private String circlePlaceId;
	    private String pictureId;
	    private String pictureUrl;

    public Timestamp getCircleDateAsTimestamp() {
        if (circleDate == null || circleDate.isEmpty()) {
            return Timestamp.valueOf(LocalDateTime.now());
        }

        try {
            // ✅ .0 제거 후 변환
            String formattedDate = circleDate.replace(".0", "").trim();
            return Timestamp.valueOf(LocalDateTime.parse(formattedDate, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        } catch (Exception e) {
            System.err.println("❌ 날짜 변환 실패: " + circleDate);
            return Timestamp.valueOf(LocalDateTime.now());
        }
    }
  
}
