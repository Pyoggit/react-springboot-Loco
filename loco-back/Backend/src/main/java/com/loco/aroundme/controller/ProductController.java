package com.loco.aroundme.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
}
