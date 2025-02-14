package com.loco.aroundme.service;

import java.io.IOException;


import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
@Service
public class CircleFileStorageService {
	public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null; // ✅ 파일이 없으면 기존 이미지 유지
        }

        // 기존 파일 저장 로직
        String originalFilename = file.getOriginalFilename();
        String fileName = System.currentTimeMillis() + "_" + originalFilename;
        String fileUrl = "/upload/" + fileName; // ✅ 저장 경로를 DB에 저장

        // 서버 파일 저장 생략 (기존 이미지 유지)
        return fileUrl;
    }
}
