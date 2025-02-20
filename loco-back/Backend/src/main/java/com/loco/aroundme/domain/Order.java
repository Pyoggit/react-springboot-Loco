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
public class Order {
	private String orderId; // 주문 고유 식별자
    private Long userId; // 사용자 ID
    private String customerName; // ✅ 구매자 이름 추가
    private String sellerName; // ✅ 판매자 이름 추가 
    private Long productId; // ✅ 상품 ID (FK) - NULL 방지
    private String productName;
    private String paymentMethod; // 결제 방법
    private Long totalAmount; // 총 결제 금액
    private String status; // 결제 상태
    private Timestamp orderDate; // 주문 생성 날짜
    private String paymentKey = ""; // ✅ 기본값 설정
}
