package com.loco.aroundme.service;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProductPicServiceImpl implements ProductPicService {

    @Value("${upload.path}")
    private String UPLOAD_DIR;

    @Override
    public String saveImage(MultipartFile image) {
        if (image.isEmpty()) {
            throw new IllegalArgumentException("이미지 파일이 비어있습니다.");
        }
        String originalFilename = image.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String finalFileName = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date()) + "_" 
                + UUID.randomUUID().toString().substring(0, 8) + fileExtension;
        File uploadFile = new File(UPLOAD_DIR + finalFileName);
        try {
            image.transferTo(uploadFile);
        } catch (IOException e) {
            throw new RuntimeException("이미지 저장 중 오류 발생", e);
        }
        return finalFileName;
    }

    @Override
    public void deleteImages(List<String> imagePaths) {
        for (String imagePath : imagePaths) {
            new File(UPLOAD_DIR + imagePath).delete();
        }
    }

    @Override
    public void deleteImagesByProductId(Long productId) {
        deleteImages(List.of(productId.toString()));
    }
}
