package com.loco.aroundme.domain;

import java.sql.Timestamp;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
	private Long productId; // 상품ID
	private Long userId; // 판매자 ID (추가)
	private String productName; // 상품명
	private int price; // 가격
	private String productCategory; // 상품 카테고리
	private String description; // 상세 설명
	private Timestamp productRegdate; // 등록일
	
	private String productAddress; // 거래 장소 주소 (추가)
	private double productLat; // 거래 장소 위도 (추가)
	private double productLng; // 거래 장소 경도 (추가)
	private String productPlaceId; // Google Places API ID (추가)

	// 상품 이미지 리스트 (연관관계)
	private List<ProductPic> images;
}
