package com.loco.aroundme.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
			throw new IllegalArgumentException("❌ userId 값이 NULL입니다.");
		}

		log.info("🔹 상품 등록 시작: {}", product);
		productMapper.insertProduct(product);
		log.info("✅ 상품 등록 완료");

		Long productId = productMapper.getLastInsertedProductId(product.getUserId());
		if (productId == null || productId <= 0) {
			throw new RuntimeException("상품 ID를 가져올 수 없습니다.");
		}
		product.setProductId(productId);

		if (images != null && !images.isEmpty()) {
			List<ProductPic> picList = new ArrayList<>();
			int order = 1;
			for (MultipartFile image : images) {
				if (!image.isEmpty()) {
					String uniqueFileName = productPicService.saveImage(image);
					picList.add(ProductPic.builder().productId(productId).pictureUrl(uniqueFileName)
							.pictureOrder(order++).build());
				}
			}
			productMapper.insertProductPics(picList);
			log.info("✅ {}개의 이미지 저장 완료", picList.size());
		}
	}

	@Override
	@Transactional
	public void updateProduct(Product product, List<MultipartFile> images) {
		log.info("🔹 상품 수정 요청: productId={}", product.getProductId());

		productMapper.updateProduct(product);
		log.info("✅ 상품 정보 업데이트 완료");

		if (images != null && !images.isEmpty()) {
			log.info("🖼 기존 이미지 삭제 및 새로운 이미지 등록 시작");

			List<String> existingImagePaths = productMapper.getProductImagePaths(List.of(product.getProductId()));
			productMapper.deleteProductPics(List.of(product.getProductId()));
			productPicService.deleteImages(existingImagePaths);

			List<ProductPic> picList = new ArrayList<>();
			int order = 1;
			for (MultipartFile image : images) {
				String uniqueFileName = productPicService.saveImage(image);
				picList.add(ProductPic.builder().productId(product.getProductId()).pictureUrl(uniqueFileName)
						.pictureOrder(order++).build());
			}
			productMapper.insertProductPics(picList);
			log.info("✅ 새로운 이미지 {}개 저장 완료", picList.size());
		}
	}

	@Override
	public Product findProductById(Long productId) {
		log.info("🔹 상품 조회 요청: productId={}", productId);
		Product product = productMapper.findProductById(productId);
		if (product != null) {
			List<ProductPic> productPics = productMapper.getProductPics(productId);
			product.setImages(productPics);
			log.info("🔹 상품 ID: {}, 판매자: {}", product.getProductId(), product.getUserName()); // ✅ 추가 확인
		}
		return product;
	}

	@Override
	public List<Map<String, Object>> getProducts() {
		log.info("🔹 전체 상품 목록 조회 요청");

		List<Product> products = productMapper.selectProducts();
		List<Map<String, Object>> productListWithDetails = new ArrayList<>();

		for (Product product : products) {
			Map<String, Object> productData = new HashMap<>();
			productData.put("productId", product.getProductId());
			productData.put("productName", product.getProductName());
			productData.put("productCategory", product.getProductCategory());
			productData.put("price", product.getPrice());
			productData.put("userName", product.getUserName()); // ✅ 판매자 이름
			productData.put("userEmail", product.getUserEmail()); // ✅ 판매자 이메일 추가
			productData.put("productRegdate", product.getProductRegdate()); // ✅ 등록일 추가

			// ✅ 이미지 정보 가져오기
			List<ProductPic> productPics = productMapper.getProductPics(product.getProductId());
			productData.put("images", productPics);

			productListWithDetails.add(productData);
		}

		return productListWithDetails;
	}

	@Override
	public List<Product> getProductsByUserId(Long userId) {
		log.info("🔹 특정 유저(userId={})가 등록한 상품 조회", userId);
		return productMapper.findProductsByUserId(userId);
	}

	@Override
	@Transactional
	public void deleteProductsByUser(List<Long> productIds, Long userId) {
		log.info("🗑 본인이 등록한 상품 삭제 실행: userId={}, productIds={}", userId, productIds);

		List<String> imagePaths = productMapper.getProductImagePaths(productIds);
		productPicService.deleteImages(imagePaths);

		productMapper.deleteProductPics(productIds);
		productMapper.deleteProducts(productIds);
		log.info("✅ 본인이 등록한 상품 삭제 완료: {}", productIds);
	}

	@Override
	public List<Product> getProductsByIds(List<Long> productIds) {
		if (productIds == null || productIds.isEmpty()) {
			return Collections.emptyList();
		}
		log.info("🔍 상품 ID 목록으로 상품 정보 조회: {}", productIds);
		return productMapper.findProductsByIds(productIds);
	}

	@Override
	public String getProductNameById(Long productId) {
		log.info("🔍 상품명 조회 요청: productId={}", productId);
		String productName = productMapper.getProductNameById(productId);

		if (productName == null) {
			log.warn("❌ 해당 상품 ID에 대한 상품명이 존재하지 않음: {}", productId);
			return "상품 정보 없음";
		}

		log.info("✅ 상품명 조회 성공: {}", productName);
		return productName;
	}

	@Override
    @Transactional(readOnly = true)
	public String getSellerNameByProductId(Long productId) {
		log.info("🔍 [상품 판매자 조회 요청] - 상품 ID: {}", productId);
		return productMapper.getSellerNameByProductId(productId);
	}

}
