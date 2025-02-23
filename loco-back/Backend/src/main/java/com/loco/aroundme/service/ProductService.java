package com.loco.aroundme.service;

import java.util.List;
import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Product;

public interface ProductService {
	// ✅ 상품 등록
	void insertProduct(Product product, List<MultipartFile> images);

	// ✅ 상품 수정
	void updateProduct(Product product, List<MultipartFile> images);

	// ✅ 상품 상세 조회
	Product findProductById(Long productId);

	// ✅ 전체 상품 조회 (판매자 정보 + 이미지 포함)
	List<Map<String, Object>> getProducts();

	// ✅ 특정 유저가 등록한 상품 조회 (하나만 유지)
	List<Product> getProductsByUserId(Long userId);

	// ✅ 본인이 등록한 상품 삭제
	void deleteProductsByUser(List<Long> productIds, Long userId);

	List<Product> getProductsByIds(List<Long> productIds);

	// ✅ 상품 ID로 상품명 조회 (새로 추가)
	String getProductNameById(Long productId);

	String getSellerNameByProductId(Long productId);

	void updateProductStatus(Long productId, String status);

}
