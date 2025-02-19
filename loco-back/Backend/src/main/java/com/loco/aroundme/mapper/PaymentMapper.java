package com.loco.aroundme.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.loco.aroundme.domain.Order;

@Mapper
public interface PaymentMapper {
	// ✅ 결제 정보 저장 (customerName 포함)
	void insertOrder(Order order);

	/** ✅ 주문 조회 (상품명 포함) */
	Order findOrderWithProductName(@Param("orderId") String orderId);

	/** ✅ 결제 승인 후 주문 상태 업데이트 */
	void updateOrderStatus(@Param("orderId") String orderId, @Param("status") String status,
			@Param("paymentKey") String paymentKey);

	/** ✅ 특정 유저의 결제 내역 조회 */
	List<Order> findPaymentsByUserId(@Param("userId") Long userId);
}
