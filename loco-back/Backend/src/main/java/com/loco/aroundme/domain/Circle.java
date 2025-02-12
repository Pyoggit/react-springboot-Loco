package com.loco.aroundme.domain;

import java.sql.Timestamp;
import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Circle {
    private Long circleId;
    private Long userId;
    private String circleName;
    private String circleCategory;
    private Timestamp circleDate;
    private int circleMaxMember;
    private int circleMember;
    private String circleDetail;
    private Timestamp circleRegdate;
    private String circleStatus;
    private String pictureId;
    private String pictureUrl;
    
    // Google Maps 관련 필드
    private String circleAddress;
    private Double circleLat;
    private Double circleLng;
    private String circlePlaceId;
}
