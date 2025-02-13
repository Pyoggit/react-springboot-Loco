package com.loco.aroundme.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Product;

public interface ProductService {
	void insertProduct(Product product, List<MultipartFile> images) throws Exception;

	Product findProductById(Long productId); // 매개변수 타입을 Long으로 변경

}
