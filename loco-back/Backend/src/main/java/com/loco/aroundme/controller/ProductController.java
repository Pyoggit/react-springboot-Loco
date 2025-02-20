package com.loco.aroundme.controller;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loco.aroundme.common.security.jwt.JwtUtil;
import com.loco.aroundme.domain.Product;
import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;
import com.loco.aroundme.service.ProductService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class ProductController {

	private final ProductService productService;
	private final JwtUtil jwtUtil;
	private final UsersMapper usersMapper;

	/** ✅ 상품 등록 API */
	@PostMapping(value = "/insert", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<String> insertProduct(@RequestPart("product") String productJson,
			@RequestPart(value = "images", required = false) List<MultipartFile> images,
			@RequestHeader("Authorization") String token) {
		try {
			Users user = validateUser(token);
			if (user == null)
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");

			ObjectMapper objectMapper = new ObjectMapper();
			Product product = objectMapper.readValue(productJson, Product.class);
			product.setUserId(user.getUserId());

			productService.insertProduct(product, images);
			return ResponseEntity.ok("상품이 성공적으로 등록되었습니다.");
		} catch (Exception e) {
			log.error("❌ 상품 등록 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 등록 중 오류 발생");
		}
	}

	/** ✅ 상품 수정 API */
	@PutMapping(value = "/update/{productId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<String> updateProduct(@PathVariable Long productId,
			@RequestPart("product") String productJson,
			@RequestPart(value = "images", required = false) List<MultipartFile> images,
			@RequestHeader("Authorization") String token) {
		try {
			log.info("🔹 상품 수정 요청: productId={}", productId);

			Users user = validateUser(token);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
			}

			Product existingProduct = productService.findProductById(productId);
			if (existingProduct == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 상품입니다.");
			}

			if (!existingProduct.getUserId().equals(user.getUserId())) {
				return ResponseEntity.status(HttpStatus.FORBIDDEN).body("본인이 등록한 상품만 수정할 수 있습니다.");
			}

			ObjectMapper objectMapper = new ObjectMapper();
			Product product = objectMapper.readValue(productJson, Product.class);
			product.setProductId(productId);

			productService.updateProduct(product, images);
			log.info("✅ 상품 수정 성공: {}", productId);

			return ResponseEntity.ok("상품이 성공적으로 수정되었습니다.");
		} catch (Exception e) {
			log.error("❌ 상품 수정 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 수정 중 오류 발생: " + e.getMessage());
		}
	}

	/** ✅ 전체 상품 목록 조회 API */
	@GetMapping("/products")
	public ResponseEntity<List<Map<String, Object>>> getProducts() {
		try {
			log.info("🔹 상품 목록 조회 요청 (판매자 정보 포함)");

			List<Map<String, Object>> products = productService.getProducts();

			// 🚨 응답 데이터 확인 (userName이 있는지 확인)
			log.info("🔹 조회된 상품 목록: {}", products);

			return ResponseEntity.ok(products);
		} catch (Exception e) {
			log.error("❌ 상품 목록 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	/** ✅ 내가 등록한 상품 목록 조회 API */
	@GetMapping("/my-products")
	public ResponseEntity<?> getMyProducts(@RequestHeader("Authorization") String token) {
		try {
			Users user = validateUser(token);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
			}

			log.info("🔹 [ProductController] 본인 상품 목록 조회 요청: userId={}", user.getUserId());

			// ✅ 본인이 등록한 상품 가져오기
			List<Product> products = productService.getProductsByUserId(user.getUserId());

			if (products == null || products.isEmpty()) {
				return ResponseEntity.ok(Collections.emptyList()); // 빈 리스트 반환
			}

			return ResponseEntity.ok(products);
		} catch (Exception e) {
			log.error("❌ 본인 상품 목록 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("본인 상품 목록 조회 중 오류가 발생했습니다.");
		}
	}

	/** ✅ 상품 삭제 API */
	@DeleteMapping("/remove")
	public ResponseEntity<String> deleteProducts(@RequestBody Map<String, List<Long>> request,
			@RequestHeader("Authorization") String token) {
		try {
			List<Long> productIds = request.get("productIds");
			log.info("🗑 상품 삭제 요청: {}", productIds);

			if (productIds == null || productIds.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("삭제할 상품 ID가 없습니다.");
			}

			Users user = validateUser(token);
			if (user == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
			}

			productService.deleteProductsByUser(productIds, user.getUserId());
			return ResponseEntity.ok("선택한 상품이 삭제되었습니다.");
		} catch (Exception e) {
			log.error("❌ 상품 삭제 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 삭제 중 오류 발생: " + e.getMessage());
		}
	}

	// ** ✅ JWT 토큰을 이용한 사용자 인증 */
	private Users validateUser(String token) {
		if (token == null || !token.startsWith("Bearer "))
			return null;
		return usersMapper.read(jwtUtil.getUserEmail(token.substring(7)));
	}

	@GetMapping("/info/{productId}")
	public ResponseEntity<Map<String, Object>> getProductInfo(@PathVariable Long productId) {
		try {
			log.info("🔹 상품 상세 조회 요청: productId={}", productId);
			Product product = productService.findProductById(productId);

			if (product == null) {
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
			}

			// ✅ product 객체에서 userName 가져오기 (usersMapper 호출 필요 없음)
			Map<String, Object> response = new HashMap<>();
			response.put("product", product);
			response.put("sellerName", product.getUserName()); // ✅ userName 직접 사용

			return ResponseEntity.ok(response);
		} catch (Exception e) {
			log.error("❌ 상품 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}

	/** ✅ 다수의 상품 ID로 상품 정보 조회 */
	@PostMapping("/products-by-ids")
	public ResponseEntity<List<Product>> getProductsByIds(@RequestBody List<Long> productIds) {
		log.info("🔍 상품 ID 기반으로 상품 조회 요청: {}", productIds);
		if (productIds == null || productIds.isEmpty())
			return ResponseEntity.badRequest().body(Collections.emptyList());

		List<Product> products = productService.getProductsByIds(productIds);
		return ResponseEntity.ok(products);
	}

	@GetMapping("/product-name/{productId}")
	public ResponseEntity<String> getProductNameById(@PathVariable String productId) {
		try {
			log.info("🔍 상품명 조회 요청: productId={}", productId);

			// ✅ productId가 숫자인지 확인하고 변환
			Long numericProductId;
			try {
				numericProductId = Long.parseLong(productId);
			} catch (NumberFormatException e) {
				log.error("❌ 잘못된 productId 형식: {}", productId);
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 상품 ID 형식입니다.");
			}

			// ✅ 상품명 조회
			String productName = productService.getProductNameById(numericProductId);

			if (productName == null) {
				log.warn("❌ 해당 상품 ID에 대한 상품명이 존재하지 않음: {}", numericProductId);
				return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 상품이 존재하지 않습니다.");
			}

			log.info("✅ 상품명 조회 성공: {}", productName);
			return ResponseEntity.ok(productName);
		} catch (Exception e) {
			log.error("❌ 상품명 조회 중 서버 오류 발생: {}", e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품명 조회 중 오류가 발생했습니다.");
		}
	}

}
