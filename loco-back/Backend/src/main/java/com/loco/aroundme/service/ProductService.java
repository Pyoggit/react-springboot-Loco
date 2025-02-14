package com.loco.aroundme.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Product;

public interface ProductService {
	// 상품 등록
	void insertProduct(Product product, List<MultipartFile> images);
	
	// 상품 수정
	void updateProduct(Product product, List<MultipartFile> images);
	
	// 상품 상세페이지
	Product findProductById(Long productId);

	// 등록된 상품 전체 조회
	List<Product> getProducts();
	
	// ✅ 선택된 상품 삭제 기능 추가
    void deleteProducts(List<Long> productIds);
}
