package com.loco.aroundme.service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductPicServiceImpl implements ProductPicService {

	private static final String UPLOAD_DIR = "C:/upload/images/";

	@Override
	public String saveImage(MultipartFile image) {
		if (image.isEmpty()) {
			throw new IllegalArgumentException("이미지 파일이 비어있습니다.");
		}
		String originalFilename = image.getOriginalFilename();
		String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
		String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

		File uploadFile = new File(UPLOAD_DIR + uniqueFileName);
		try {
			image.transferTo(uploadFile);
		} catch (IOException e) {
			throw new RuntimeException("이미지 저장 중 오류 발생", e);
		}
		return uniqueFileName;
	}
}
