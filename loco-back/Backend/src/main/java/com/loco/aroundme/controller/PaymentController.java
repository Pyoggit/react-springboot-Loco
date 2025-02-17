package com.loco.aroundme.controller;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.loco.aroundme.domain.Order;
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

	@Value("${toss.secret-key}")
	private String SECRET_KEY;

	/**
	 * ✅ 결제 요청 정보 저장 (Frontend → Backend)
	 */
	@PostMapping("/create-order")
	public ResponseEntity<?> createOrder(@RequestBody Order order) {
		try {
			// ✅ orderId가 없으면 자동 생성
			if (order.getOrderId() == null) {
				String orderId = "ORDER_" + UUID.randomUUID().toString().replace("-", "").substring(0, 10);
				order.setOrderId(orderId);
			}

			log.info("🛒 [주문 생성 요청] - 주문 ID: {}, 상품 ID: {}, 구매자: {}", order.getOrderId(), order.getProductId(),
					order.getCustomerName());

			// ✅ 주문 저장 (구매자 이름 포함)
			paymentService.saveOrder(order);

			Map<String, Object> response = new HashMap<>();
			response.put("success", true);
			response.put("message", "주문이 성공적으로 생성되었습니다.");
			response.put("orderId", order.getOrderId());

			return ResponseEntity.ok(response);
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
		Integer amount = (requestData.get("totalAmount") != null) ? (Integer) requestData.get("totalAmount") : null;

		log.info("🔹 [결제 승인 요청] - Order ID: {}, PaymentKey: {}, Amount: {}", orderId, paymentKey, amount);

		if (paymentKey == null || orderId == null || amount == null) {
			log.error("❌ [결제 승인 실패] 필수 데이터가 누락되었습니다. orderId: {}, amount: {}, paymentKey: {}", orderId, amount,
					paymentKey);
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "결제 승인 데이터 누락"));
		}

		HttpHeaders headers = new HttpHeaders();
		String encodedSecretKey = Base64.getEncoder().encodeToString((SECRET_KEY + ":").getBytes());
		headers.set("Authorization", "Basic " + encodedSecretKey);
		headers.setContentType(MediaType.APPLICATION_JSON);

		Map<String, Object> body = new HashMap<>();
		body.put("paymentKey", paymentKey);
		body.put("orderId", orderId);
		body.put("amount", amount);

		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
		RestTemplate restTemplate = new RestTemplate();

		try {
			ResponseEntity<String> response = restTemplate.exchange("https://api.tosspayments.com/v1/payments/confirm",
					HttpMethod.POST, entity, String.class);

			log.info("✅ [결제 승인 성공] - Order ID: {}", orderId);
			paymentService.updatePaymentStatus(orderId, "COMPLETED", paymentKey);

			return ResponseEntity.ok(Map.of("success", true, "message", "결제 승인 성공", "orderId", orderId));
		} catch (HttpClientErrorException e) {
			log.error("❌ [결제 승인 실패] - Status: {}, Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
			return ResponseEntity.status(e.getStatusCode()).body(Map.of("success", false, "message", "결제 승인 실패"));
		}
	}
}
