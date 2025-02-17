package com.loco.aroundme.service;

import com.loco.aroundme.domain.Order;

public interface PaymentService {
	/** ✅ 주문 정보 저장 (구매자 이름 추가) */
	void saveOrder(Order order);

	/** ✅ 주문 정보 조회 (상품명 포함) */
	Order getOrderWithProductName(String orderId);

	/** ✅ 결제 승인 후 주문 상태 업데이트 */
	void updatePaymentStatus(String orderId, String status, String paymentKey);
}
