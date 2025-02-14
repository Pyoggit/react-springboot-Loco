package com.loco.aroundme.service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    private final String uploadDir = "C:/upload/"; // ✅ 실제 이미지 저장 경로 (서버 환경에 맞게 수정)

    /** ✅ 이미지 저장 후 URL 반환 */
    public String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // ✅ 파일명 UUID 적용하여 중복 방지
        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf("."));
        String newFilename = UUID.randomUUID().toString() + ext;

        // ✅ 디렉토리 존재 확인 및 생성
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs(); // 폴더가 없으면 생성
        }

        // ✅ 서버에 저장
        File destFile = new File(uploadDir + newFilename);
        file.transferTo(destFile);

        // ✅ 저장된 파일의 경로 반환 (프론트에서 접근 가능하게 수정 필요)
        return "/uploads/" + newFilename;
    }
}
