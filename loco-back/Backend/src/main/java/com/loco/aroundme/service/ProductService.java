package com.loco.aroundme.service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import com.loco.aroundme.domain.Product;

public interface ProductService {
    // ✅ 상품 등록
    void insertProduct(Product product, List<MultipartFile> images);

    // ✅ 상품 수정
    void updateProduct(Product product, List<MultipartFile> images);

    // ✅ 상품 상세 조회
    Product findProductById(Long productId);

    // ✅ 전체 상품 조회
    List<Product> getProducts();

    // ✅ 특정 유저가 등록한 상품 조회 (하나만 유지)
    List<Product> getProductsByUserId(Long userId);

    // ✅ 본인이 등록한 상품 삭제
    void deleteProductsByUser(List<Long> productIds, Long userId);
}
