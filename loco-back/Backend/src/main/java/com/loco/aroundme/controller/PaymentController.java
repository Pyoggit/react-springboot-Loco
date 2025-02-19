package com.loco.aroundme.controller;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Order;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;
import com.loco.aroundme.service.PaymentService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173") // ✅ CORS 설정 추가
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;
	private final UsersMapper usersMapper;
	private final JwtUtil jwtUtil; // ✅ JWT 유틸 추가

	@Value("${toss.secret-key}")
	private String SECRET_KEY;

	/**
	 * ✅ 결제 요청 정보 저장 (Frontend → Backend)
	 */
	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@RequestBody Order order) {
		try {
			if (order.getOrderId() == null) {
				order.setOrderId("ORDER_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
			}

			log.info("🛒 [주문 생성 요청] - 주문 ID: {}, 상품 ID: {}, 상품명: {}, 구매자: {}", order.getOrderId(), order.getProductId(),
					order.getProductName(), order.getCustomerName());

			paymentService.saveOrder(order);

			return ResponseEntity
					.ok(Map.of("success", true, "message", "주문이 성공적으로 생성되었습니다.", "orderId", order.getOrderId()));
		} catch (Exception e) {
			log.error("❌ [결제 정보 저장 오류] {}", e.getMessage(), e);
			return ResponseEntity.status(500).body(Map.of("success", false, "message", "결제 정보 저장 중 오류 발생"));
		}
	}

	/**
	 * ✅ Toss Payments 결제 승인 요청 (Backend → Toss API)
	 */
	@PostMapping("/confirm")
	public ResponseEntity<?> confirmPayment(@RequestBody Map<String, Object> requestData) {
		String paymentKey = (String) requestData.get("paymentKey");
		String orderId = (String) requestData.get("orderId");
		Integer amount = (Integer) requestData.get("totalAmount");

		log.info("🔹 [결제 승인 요청] - Order ID: {}, PaymentKey: {}, Amount: {}", orderId, paymentKey, amount);

		if (paymentKey == null || orderId == null || amount == null) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "결제 승인 데이터 누락"));
		}

		HttpHeaders headers = new HttpHeaders();
		String encodedSecretKey = Base64.getEncoder().encodeToString((SECRET_KEY + ":").getBytes());
		headers.set("Authorization", "Basic " + encodedSecretKey);
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
				Map.of("paymentKey", paymentKey, "orderId", orderId, "amount", amount), headers);
		RestTemplate restTemplate = new RestTemplate();

		try {
			restTemplate.exchange("https://api.tosspayments.com/v1/payments/confirm", HttpMethod.POST, entity,
					String.class);
			paymentService.updatePaymentStatus(orderId, "COMPLETED", paymentKey);

			return ResponseEntity.ok(Map.of("success", true, "message", "결제 승인 성공", "orderId", orderId));
		} catch (HttpClientErrorException e) {
			log.error("❌ [결제 승인 실패] - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
			return ResponseEntity.status(e.getStatusCode()).body(Map.of("success", false, "message", "결제 승인 실패"));
		}
	}

	/** ✅ 내 결제 내역 조회 API */
	@GetMapping("/my-orders")
	public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String token) {
		try {
			Users user = validateUser(token);
			if (user == null) {
				return ResponseEntity.status(401).body("로그인이 필요합니다.");
			}

			log.info("🔹 [PaymentController] 유저 결제 내역 조회 요청: userId={}", user.getUserId());

			List<Order> payments = paymentService.getPaymentsByUserId(user.getUserId());

			for (Order order : payments) {
				log.info("✅ 주문 정보: orderId={}, productId={}, 상품명={}", order.getOrderId(), order.getProductId(),
						order.getProductName());
			}

			return ResponseEntity.ok(payments);
		} catch (Exception e) {
			log.error("❌ 결제 내역 조회 중 오류 발생", e);
			return ResponseEntity.status(500).body("결제 내역 조회 중 오류가 발생했습니다.");
		}
	}

	/** ✅ JWT 토큰을 이용한 사용자 인증 */
	private Users validateUser(String token) {
		if (token == null || !token.startsWith("Bearer ")) {
			return null;
		}
		try {
			String email = jwtUtil.getUserEmail(token.substring(7));
			return usersMapper.read(email);
		} catch (Exception e) {
			log.error("❌ 토큰 검증 실패: {}", e.getMessage());
			return null;
		}
	}
}
