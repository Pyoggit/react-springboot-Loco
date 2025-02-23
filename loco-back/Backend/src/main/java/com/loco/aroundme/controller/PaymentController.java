package com.loco.aroundme.controller;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Order;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;
import com.loco.aroundme.service.PaymentService;
import com.loco.aroundme.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class PaymentController {

	private final PaymentService paymentService;
	private final ProductService productService;
	private final UsersMapper usersMapper;
	private final JwtUtil jwtUtil;

	@Value("${toss.secret-key}")
	private String SECRET_KEY;

	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@RequestBody Order order) {
		try {
			if (order.getOrderId() == null) {
				order.setOrderId("ORDER_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10));
			}

			// ✅ 상품 판매자 정보 조회 (추가)
			String sellerName = productService.getSellerNameByProductId(order.getProductId());
			order.setSellerName(sellerName);

			log.info("🛒 [주문 생성 요청] - 주문 ID: {}, 상품 ID: {}, 상품명: {}, 구매자: {}, 판매자: {}", order.getOrderId(),
					order.getProductId(), order.getProductName(), order.getCustomerName(), order.getSellerName());

			paymentService.saveOrder(order);

			return ResponseEntity
					.ok(Map.of("success", true, "message", "주문이 성공적으로 생성되었습니다.", "orderId", order.getOrderId()));
		} catch (Exception e) {
			log.error("❌ [결제 정보 저장 오류] {}", e.getMessage(), e);
			return ResponseEntity.status(500).body(Map.of("success", false, "message", "결제 정보 저장 중 오류 발생"));
		}
	}

	@PostMapping("/confirm")
	public ResponseEntity<?> confirmPayment(@RequestBody Map<String, Object> requestData) {
		String paymentKey = (String) requestData.get("paymentKey");
		String orderId = (String) requestData.get("orderId");
		Integer amount = (Integer) requestData.get("totalAmount");

		log.info("🔹 [결제 승인 요청] - Order ID: {}, PaymentKey: {}, Amount: {}", orderId, paymentKey, amount);

		if (paymentKey == null || orderId == null || amount == null) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "결제 승인 데이터 누락"));
		}

		try {
			// ✅ Toss Payments API로 결제 승인 요청
			HttpHeaders headers = new HttpHeaders();
			String encodedSecretKey = Base64.getEncoder().encodeToString((SECRET_KEY + ":").getBytes());
			headers.set("Authorization", "Basic " + encodedSecretKey);
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<Map<String, Object>> entity = new HttpEntity<>(
					Map.of("paymentKey", paymentKey, "orderId", orderId, "amount", amount), headers);

			RestTemplate restTemplate = new RestTemplate();
			ResponseEntity<String> tossResponse = restTemplate.exchange(
					"https://api.tosspayments.com/v1/payments/confirm", HttpMethod.POST, entity, String.class);

			if (tossResponse.getStatusCode() == HttpStatus.OK) {
				paymentService.updatePaymentStatus(orderId, "COMPLETED", paymentKey);
				return ResponseEntity.ok(Map.of("success", true, "message", "결제 승인 성공", "orderId", orderId));
			} else {
				log.error("❌ [결제 승인 실패] - Toss 응답: {}", tossResponse.getBody());
				return ResponseEntity.status(HttpStatus.BAD_REQUEST)
						.body(Map.of("success", false, "message", "결제 승인 실패"));
			}
		} catch (Exception e) {
			log.error("❌ [결제 승인 중 서버 오류 발생]", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("success", false, "message", "서버 오류 발생"));
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
		if (token == null || !token.startsWith("Bearer ")) // {
			return null;
		return usersMapper.read(jwtUtil.getUserEmail(token.substring(7)));
	}

	/** ✅ 전체 주문 목록 조회 API */
	@GetMapping("/all-orders")
	public ResponseEntity<?> getAllOrders(@RequestHeader(value = "Authorization", required = false) String token) {
		try {
			log.info("🔹 전체 주문 목록 조회 요청");

			List<Map<String, Object>> orders = paymentService.getAllOrders();

			if (orders.isEmpty()) {
				return ResponseEntity.status(HttpStatus.NO_CONTENT).body("주문 내역이 없습니다.");
			}
			log.info("🔹 조회된 주문 목록: {}", orders);

			return ResponseEntity.ok(orders);
		} catch (Exception e) {
			log.error("❌ 주문 목록 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
		}
	}

	@DeleteMapping("/remove-orders")
	public ResponseEntity<?> deleteOrders(@RequestBody Map<String, List<String>> request,
			@RequestHeader("Authorization") String token) {
		try {
			List<String> orderIds = request.get("orderIds");
			log.info("🗑 주문 삭제 요청: {}", orderIds);
			if (orderIds == null || orderIds.isEmpty()) {
				return ResponseEntity.status(400).body("삭제할 주문이 없습니다.");
			}

			paymentService.deleteOrders(orderIds);
			return ResponseEntity.ok(Map.of("success", true, "message", "주문이 삭제되었습니다."));
		} catch (Exception e) {
			log.error("❌ 주문 삭제 실패:", e);
			return ResponseEntity.status(500).body("주문 삭제 중 오류 발생");
		}
	}
}
