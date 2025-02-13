package com.loco.aroundme.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

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
	private final ProductPicService productPicService; // 추가: ProductPicService 주입

	@Override
	@Transactional
	public void insertProduct(Product product, List<MultipartFile> images) {
		if (product.getUserId() == null) {
			throw new IllegalArgumentException("❌ [ProductServiceImpl] userId 값이 NULL입니다.");
		}

		log.info("🔹 [ProductServiceImpl] 상품 등록 시작: {}", product);

		// 1. 상품 등록
		productMapper.insertProduct(product);
		log.info("✅ [ProductServiceImpl] 상품 등록 완료");

		// 2. 상품 등록 후 생성된 ID 가져오기
		Long productId = productMapper.getLastInsertedProductId(product.getUserId());
		if (productId == null || productId <= 0) {
			throw new RuntimeException("상품 ID를 가져올 수 없습니다. (PRODUCT_SEQ 설정 확인 필요)");
		}
		log.info("📌 [ProductServiceImpl] 가져온 상품 ID: {}", productId);
		product.setProductId(productId);

		// 3. 이미지 업로드 및 DB 저장 (ProductPic 사용)
		if (images != null && !images.isEmpty()) {
			List<ProductPic> picList = new ArrayList<>();
			int order = 1;

			for (MultipartFile image : images) {
				if (!image.isEmpty()) {
					// ProductPicService를 사용하여 이미지 저장 후 파일명을 반환받음
					String uniqueFileName = productPicService.saveImage(image);

					ProductPic productPic = ProductPic.builder().productId(productId).pictureUrl(uniqueFileName)
							.pictureOrder(order++).build();

					picList.add(productPic);
				}
			}

			if (!picList.isEmpty()) {
				productMapper.insertProductPics(picList);
				log.info("✅ [ProductServiceImpl] {}개의 이미지가 저장되었습니다.", picList.size());
			}
		}
	}

	@Override
	public Product findProductById(Long productId) {
		log.info("🔹 [ProductServiceImpl] 상품 조회 요청: productId={}", productId);

		Product product = productMapper.findProductById(productId);
		if (product == null) {
			log.error("❌ [ProductServiceImpl] 해당 상품이 존재하지 않음: productId={}", productId);
			throw new RuntimeException("해당 ID의 상품이 존재하지 않습니다: " + productId);
		}

		List<ProductPic> pics = productMapper.getProductPics(productId);
		// 기존 Product의 images 필드 대신, 필요에 따라 pics로 매핑
		// 예) product.setImages(pics);
		log.info("✅ [ProductServiceImpl] 조회된 상품: {}", product);

		return product;
	}

	@Override
	public List<Product> getProducts() {
		log.info("🔹 [ProductServiceImpl] 전체 상품 목록 조회 요청");
		return productMapper.selectProducts();
	}
}
