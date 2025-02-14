package com.loco.aroundme.domain;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductPic {
	private Long pictureId; // 이미지 ID (PK)
	private Long productId; // 상품 ID (FK)
	private String pictureUrl; // 이미지 URL
	private int pictureOrder; // 이미지 순서 (썸네일 = 1)
	private Timestamp pictureRegdate; // 등록일

	// 🔹 기존 생성자와 충돌하지 않도록 필요한 생성자 추가
	public ProductPic(Long productId, String pictureUrl, int pictureOrder) {
		this.productId = productId;
		this.pictureUrl = pictureUrl;
		this.pictureOrder = pictureOrder;
	}
}
