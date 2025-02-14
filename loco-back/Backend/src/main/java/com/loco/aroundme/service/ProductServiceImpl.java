package com.loco.aroundme.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.loco.aroundme.domain.Product;
import com.loco.aroundme.domain.ProductPic;
import com.loco.aroundme.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final ProductPicService productPicService;

    @Override
    @Transactional
    public void insertProduct(Product product, List<MultipartFile> images) {
        if (product.getUserId() == null) {
            throw new IllegalArgumentException("❌ [ProductServiceImpl] userId 값이 NULL입니다.");
        }

        log.info("🔹 [ProductServiceImpl] 상품 등록 시작: {}", product);
        productMapper.insertProduct(product);
        log.info("✅ [ProductServiceImpl] 상품 등록 완료");

        Long productId = productMapper.getLastInsertedProductId(product.getUserId());
        if (productId == null || productId <= 0) {
            throw new RuntimeException("상품 ID를 가져올 수 없습니다.");
        }
        log.info("📌 [ProductServiceImpl] 가져온 상품 ID: {}", productId);
        product.setProductId(productId);

        if (images != null && !images.isEmpty()) {
            List<ProductPic> picList = new ArrayList<>();
            int order = 1;
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String uniqueFileName = productPicService.saveImage(image);
                    picList.add(ProductPic.builder()
                        .productId(productId)
                        .pictureUrl(uniqueFileName)
                        .pictureOrder(order++)
                        .build());
                }
            }
            productMapper.insertProductPics(picList);
            log.info("✅ [ProductServiceImpl] {}개의 이미지가 저장되었습니다.", picList.size());
        }
    }

    @Override
    @Transactional
    public void updateProduct(Product product, List<MultipartFile> images) {
        log.info("🔹 [ProductServiceImpl] 상품 수정 요청: productId={}", product.getProductId());

        productMapper.updateProduct(product);
        log.info("✅ [ProductServiceImpl] 상품 정보 업데이트 완료");

        if (images != null && !images.isEmpty()) {
            log.info("🖼 [ProductServiceImpl] 기존 이미지 삭제 및 새로운 이미지 등록 시작");

            // ✅ 기존 이미지 삭제 (DB 및 실제 파일 삭제)
            List<String> existingImagePaths = productMapper.getProductImagePaths(List.of(product.getProductId()));
            productMapper.deleteProductPics(List.of(product.getProductId()));
            productPicService.deleteImages(existingImagePaths);

            // ✅ 새로운 이미지 저장
            List<ProductPic> picList = new ArrayList<>();
            int order = 1;
            for (MultipartFile image : images) {
                String uniqueFileName = productPicService.saveImage(image);
                picList.add(ProductPic.builder()
                    .productId(product.getProductId()) // 수정된 상품 ID
                    .pictureUrl(uniqueFileName) // 저장된 이미지 파일명
                    .pictureOrder(order++) // 이미지 순서
                    .build());
            }
            productMapper.insertProductPics(picList);
            log.info("✅ [ProductServiceImpl] 새로운 이미지 {}개 저장 완료", picList.size());
        }
    }

    @Override
    public Product findProductById(Long productId) {
        log.info("🔹 [ProductServiceImpl] 상품 조회 요청: productId={}", productId);
        Product product = productMapper.findProductById(productId);
        product.setImages(productMapper.getProductPics(productId));
        return product;
    }

    @Override
    public List<Product> getProducts() {
        log.info("🔹 [ProductServiceImpl] 전체 상품 목록 조회 요청");
        return productMapper.selectProducts();
    }

    @Override
    @Transactional
    public void deleteProducts(List<Long> productIds) {
        log.info("🗑 [ProductServiceImpl] 상품 삭제 실행: {}", productIds);

        // ✅ 삭제할 상품들의 이미지 목록 가져오기
        List<String> imagePaths = productMapper.getProductImagePaths(productIds);
        productPicService.deleteImages(imagePaths);

        productMapper.deleteProductPics(productIds);
        productMapper.deleteProducts(productIds);
        log.info("✅ [ProductServiceImpl] 상품 삭제 완료: {}", productIds);
    }
}
