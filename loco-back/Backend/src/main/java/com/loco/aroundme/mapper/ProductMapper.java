package com.loco.aroundme.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.loco.aroundme.domain.Product;
import com.loco.aroundme.domain.ProductPic;

@Mapper
public interface ProductMapper {
    // ✅ 상품 등록
    void insertProduct(Product product);

    // ✅ 마지막으로 등록한 상품 ID 조회
    Long getLastInsertedProductId(@Param("userId") Long userId);

    // ✅ 상품 수정
    void updateProduct(Product product);

    // ✅ 특정 상품 조회
    Product findProductById(@Param("productId") Long productId);

    // ✅ 특정 유저가 등록한 상품 조회
    List<Product> findProductsByUserId(@Param("userId") Long userId);

    // ✅ 전체 상품 조회
    List<Product> selectProducts();

    // ✅ 특정 상품의 이미지 조회
    List<ProductPic> getProductPics(@Param("productId") Long productId);

    // ✅ 특정 상품의 이미지 경로 조회 (삭제 시 필요)
    List<String> getProductImagePaths(@Param("productIds") List<Long> productIds);

    // ✅ 특정 상품의 이미지 삭제
    void deleteProductPics(@Param("productIds") List<Long> productIds);

    // ✅ 특정 상품 삭제
    void deleteProducts(@Param("productIds") List<Long> productIds);

    // ✅ 상품 이미지 저장
    void insertProductPics(@Param("productPics") List<ProductPic> productPics);
}
