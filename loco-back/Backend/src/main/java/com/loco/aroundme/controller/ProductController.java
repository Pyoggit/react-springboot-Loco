package com.loco.aroundme.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loco.aroundme.domain.Product;
import com.loco.aroundme.service.ProductService;

@RestController
@RequestMapping("/api/market")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

	@Autowired
	private final ProductService productService;

	public ProductController(ProductService productService) {
		this.productService = productService;
	}

	@PostMapping("/insert")
	public ResponseEntity<String> insertProduct(@RequestParam("product") String productJson, // JSON을 String으로 받기
			@RequestParam(value = "images", required = false) List<MultipartFile> images) {
		try {
			// JSON 문자열을 객체로 변환
			ObjectMapper objectMapper = new ObjectMapper();
			Product product = objectMapper.readValue(productJson, Product.class);

			productService.insertProduct(product, images);
			return ResponseEntity.ok("상품이 성공적으로 등록되었습니다.");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("상품 등록 중 오류 발생: " + e.getMessage());
		}
	}

}
