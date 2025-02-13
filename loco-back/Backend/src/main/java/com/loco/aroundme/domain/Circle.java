package com.loco.aroundme.domain;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.Data;

@Data
public class Circle {
    private int circleId;
    private int userId;
    private String circleName;
    private String circleCategory;
    private String circleDate; // ✅ String으로 변경 (프론트에서 String으로 넘겨주므로)
    private int circleMaxMember;
    private int circleMember;
    private String circleDetail;
    private String circleAddress;
    private Double circleLat;
    private Double circleLng;
    private String circlePlaceId;
    private String pictureId;
    private String pictureUrl;

    public Timestamp getCircleDateAsTimestamp() {
        if (circleDate == null || circleDate.isEmpty()) {
            return Timestamp.valueOf(LocalDateTime.now()); // 기본값 현재 시간
        }
        return Timestamp.valueOf(LocalDateTime.parse(circleDate, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    }
}
