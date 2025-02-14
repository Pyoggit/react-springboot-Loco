package com.loco.aroundme.controller;

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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loco.aroundme.domain.Product;
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

	@PostMapping(value = "/insert", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<String> insertProduct(@RequestPart("product") String productJson,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {

		try {
			log.info("🔹 [ProductController] 상품 등록 요청 수신");
			log.info("📦 productJson: {}", productJson);

			// ✅ JSON을 Product 객체로 변환
			ObjectMapper objectMapper = new ObjectMapper();
			Product product = objectMapper.readValue(productJson, Product.class);

			// ✅ userId 값 검증
			if (product.getUserId() == null) {
				log.error("❌ [ProductController] userId 값이 NULL입니다.");
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("userId 값이 필요합니다.");
			}

			log.info("🔹 [ProductController] 변환된 상품 객체: {}", product);

			// ✅ 상품 등록 서비스 호출
			productService.insertProduct(product, images);

			log.info("✅ [ProductController] 상품 등록 완료");
			return ResponseEntity.ok("상품이 성공적으로 등록되었습니다.");
		} catch (Exception e) {
			log.error("❌ [ProductController] 상품 등록 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 등록 중 오류 발생: " + e.getMessage());
		}
	}

	@PutMapping(value = "/update/{productId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
	public ResponseEntity<String> updateProduct(@PathVariable Long productId,
			@RequestPart("product") String productJson,
			@RequestPart(value = "images", required = false) List<MultipartFile> images) {
		try {
			log.info("🔹 [ProductController] 상품 수정 요청: productId={}", productId);

			ObjectMapper objectMapper = new ObjectMapper();
			Product product = objectMapper.readValue(productJson, Product.class);
			product.setProductId(productId);

			productService.updateProduct(product, images);

			return ResponseEntity.ok("상품이 성공적으로 수정되었습니다.");
		} catch (Exception e) {
			log.error("❌ [ProductController] 상품 수정 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 수정 중 오류 발생: " + e.getMessage());
		}
	}

	@GetMapping("/products")
	public ResponseEntity<List<Product>> getProducts() {
		try {
			log.info("🔹 [ProductController] 상품 목록 조회 요청 수신");
			List<Product> products = productService.getProducts();
			return ResponseEntity.ok(products);
		} catch (Exception e) {
			log.error("❌ [ProductController] 상품 목록 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	// ✅ 상품 삭제 요청 처리
	@DeleteMapping("/remove")
	public ResponseEntity<String> deleteProducts(@RequestBody Map<String, List<Long>> request) {
		try {
			List<Long> productIds = request.get("productIds");
			log.info("🗑 [ProductController] 상품 삭제 요청 수신: {}", productIds);

			if (productIds == null || productIds.isEmpty()) {
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("삭제할 상품 ID가 없습니다.");
			}

			productService.deleteProducts(productIds);
			return ResponseEntity.ok("선택한 상품이 삭제되었습니다.");
		} catch (Exception e) {
			log.error("❌ [ProductController] 상품 삭제 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("상품 삭제 중 오류 발생: " + e.getMessage());
		}
	}

	// ✅ 상품 상세 조회
	@GetMapping("/info/{productId}")
	public ResponseEntity<Product> getProductInfo(@PathVariable Long productId) {
		try {
			log.info("🔹 상품 상세 조회 요청: productId={}", productId);
			Product product = productService.findProductById(productId);
			return ResponseEntity.ok(product);
		} catch (Exception e) {
			log.error("❌ 상품 조회 중 오류 발생", e);
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}
}
