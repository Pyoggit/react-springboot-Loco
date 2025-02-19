package com.loco.aroundme.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.loco.aroundme.domain.Order;
import com.loco.aroundme.mapper.PaymentMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

	private final PaymentMapper paymentMapper;

	/** ✅ 주문 저장 */
	@Override
	@Transactional
	public void saveOrder(Order order) {
		log.info("🛒 [주문 저장 요청] - {}", order);

		if (order.getOrderId() == null) {
			order.setOrderId("ORDER_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
		}

		if (order.getPaymentKey() == null) {
			order.setPaymentKey("");
		}

		order.setStatus("PENDING");
		paymentMapper.insertOrder(order);

		log.info("✅ [주문 저장 완료] - Order ID: {}, 상품명: {}, 구매자: {}", order.getOrderId(), order.getProductName(),
				order.getCustomerName());
	}

	/** ✅ 주문 조회 (상품명 포함) */
	@Override
	@Transactional(readOnly = true)
	public Order getOrderWithProductName(String orderId) {
		log.info("🔍 주문 조회: orderId={}", orderId);
		Order order = paymentMapper.findOrderWithProductName(orderId);

		if (order != null) {
			log.info("✅ 주문 정보 조회 완료: orderId={}, productName={}", order.getOrderId(), order.getProductName());
		}

		return order;
	}

	/** ✅ 결제 승인 후 주문 상태 업데이트 */
	@Override
	@Transactional
	public void updatePaymentStatus(String orderId, String status, String paymentKey) {
		log.info("🔹 [결제 상태 업데이트 요청] - Order ID: {}, Status: {}, Payment Key: {}", orderId, status, paymentKey);
		paymentMapper.updateOrderStatus(orderId, status, paymentKey);
		log.info("✅ [결제 상태 업데이트 완료] - Order ID: {}", orderId);
	}

	/** ✅ 특정 유저 결제 내역 조회 */
	@Override
	@Transactional(readOnly = true)
	public List<Order> getPaymentsByUserId(Long userId) {
		log.info("🔍 특정 유저 결제 내역 조회: userId={}", userId);
		List<Order> orders = paymentMapper.findPaymentsByUserId(userId);

		for (Order order : orders) {
			log.info("🛒 주문 정보: orderId={}, productId={}, 상품명={}", order.getOrderId(), order.getProductId(),
					order.getProductName());
		}

		return orders;
	}

}
