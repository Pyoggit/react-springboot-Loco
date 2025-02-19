package com.loco.aroundme.service;

import java.util.List;

import com.loco.aroundme.domain.Order;

public interface PaymentService {
	/** ✅ 주문 정보 저장 (구매자 이름 추가) */
	void saveOrder(Order order);

	/** ✅ 주문 정보 조회 (상품명 포함) */
	Order getOrderWithProductName(String orderId);

	/** ✅ 결제 승인 후 주문 상태 업데이트 */
	void updatePaymentStatus(String orderId, String status, String paymentKey);

	/** ✅ 특정 유저의 결제 내역 조회 */
	List<Order> getPaymentsByUserId(Long userId);
}
