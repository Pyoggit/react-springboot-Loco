package com.loco.aroundme.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface ProductPicService {

	String saveImage(MultipartFile image);

	/// ✅ 삭제할 이미지 파일들을 물리적으로 삭제하는 메서드 추가
    void deleteImages(List<String> imagePaths);

    // ✅ 특정 상품 ID로 이미지 삭제
    void deleteImagesByProductId(Long productId);
}
