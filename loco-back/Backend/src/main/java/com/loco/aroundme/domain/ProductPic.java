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
}
