package com.loco.aroundme.service;

import java.io.File;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Product;
import com.loco.aroundme.domain.ProductImage;
import com.loco.aroundme.mapper.ProductMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

	private final ProductMapper productMapper;
	private static final String UPLOAD_DIR = "C:/upload/images/"; // 🔥 이미지 저장 경로

	@Override
	public void insertProduct(Product product, List<MultipartFile> images) throws Exception {
		// ✅ 상품 정보 저장
		productMapper.insertProduct(product);

		// ✅ 상품 등록 후 생성된 ID 가져오기
		Long productId = product.getProductId();
		if (productId == null || productId <= 0) {
			throw new RuntimeException("상품 ID를 가져올 수 없습니다. (PRODUCT_SEQ.NEXTVAL 사용 확인)");
		}

		// ✅ 이미지 업로드 및 저장
		if (images != null && !images.isEmpty()) {
			int order = 1;
			for (MultipartFile image : images) {
				if (!image.isEmpty()) {
					String originalFilename = image.getOriginalFilename();
					String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
					String uniqueFileName = UUID.randomUUID() + fileExtension;

					// ✅ 서버에 파일 저장
					File uploadFile = new File(UPLOAD_DIR + uniqueFileName);
					image.transferTo(uploadFile);

					// ✅ DB에 이미지 경로 저장
					ProductImage productImage = ProductImage.builder().productId(productId).pictureUrl(uniqueFileName) // ✅
																														// 저장된
																														// 파일명
							.pictureOrder(order++) // ✅ 이미지 순서
							.build();

					productMapper.insertProductImage(productImage);
				}
			}
		}
	}

	@Override
	public Product findProductById(Long productId) {
		Product product = productMapper.findProductById(productId);
		if (product == null) {
			throw new RuntimeException("해당 ID의 상품이 존재하지 않습니다: " + productId);
		}
		// ✅ 상품의 이미지 목록 조회하여 추가
		List<ProductImage> images = productMapper.getProductImages(productId);
		product.setImages(images);
		return product;
	}
}
