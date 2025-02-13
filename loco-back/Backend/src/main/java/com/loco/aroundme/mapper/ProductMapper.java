package com.loco.aroundme.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.loco.aroundme.domain.Product;
import com.loco.aroundme.domain.ProductImage;

@Mapper
public interface ProductMapper {
	// 상품 등록 (자동 생성된 ID 반환)
	void insertProduct(Product product);

	// 상품 조회 (ID 기반)
	Product findProductById(Long productId);

	// 상품 이미지 등록
	void insertProductImage(ProductImage productImage);

	// 특정 상품의 모든 이미지 조회
	List<ProductImage> getProductImages(Long productId);
}
