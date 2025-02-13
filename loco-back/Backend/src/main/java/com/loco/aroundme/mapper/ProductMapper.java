package com.loco.aroundme.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import com.loco.aroundme.domain.Product;
import com.loco.aroundme.domain.ProductPic;

@Mapper
public interface ProductMapper {
	// ✅ 상품 등록
	void insertProduct(Product product);

	// ✅ 특정 상품 조회 (ID 기반)
	Product findProductById(Long productId);

	// ✅ 최근 등록된 상품의 ID 가져오기
	Long getLastInsertedProductId(@Param("userId") Long userId);

	// ✅ 상품 이미지(Pic) 등록
	void insertProductPics(@Param("list") List<ProductPic> pics);

	// ✅ 특정 상품의 모든 이미지(Pic) 조회
	List<ProductPic> getProductPics(Long productId);

	// ✅ 전체 상품 조회
	List<Product> selectProducts();
}
