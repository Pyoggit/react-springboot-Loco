package com.loco.aroundme.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Product;

public interface ProductService {
	void insertProduct(Product product, List<MultipartFile> images);
	Product findProductById(Long productId);

	// 등록된 상품 전체 조회
	List<Product> getProducts();
}
