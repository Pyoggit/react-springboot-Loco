package com.loco.aroundme.service;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.UUID;

import org.apache.ibatis.session.SqlSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.loco.aroundme.domain.Users;
import com.loco.aroundme.mapper.UsersMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UsersServiceImpl implements UsersService {

    private final UsersMapper usersMapper;
    private final BCryptPasswordEncoder passwordEncoder;
    private static final String UPLOAD_DIR = "C:/upload/";

    @Override
    @Transactional
    public void registerUser(Users user, MultipartFile profileImage) throws Exception {
        if (user == null || user.getUserEmail() == null || user.getUserEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("User 정보가 유효하지 않습니다.");
        }

        if (user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            throw new IllegalArgumentException("비밀번호는 필수 입력 사항입니다.");
        }

        user.setProvider(user.getProvider() == null || user.getProvider().trim().isEmpty() ? null : user.getProvider());
        user.setProviderId(user.getProviderId() == null || user.getProviderId().trim().isEmpty() ? null : user.getProviderId());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getRoleId() == null) {
            user.setRoleId(2L);
        }
        user.setUserRegDate(new Date());

        // 입력하지 않은 값은 null 처리
        user.setPhone1(user.getPhone1() == null || user.getPhone1().trim().isEmpty() ? null : user.getPhone1());
        user.setPhone2(user.getPhone2() == null || user.getPhone2().trim().isEmpty() ? null : user.getPhone2());
        user.setPhone3(user.getPhone3() == null || user.getPhone3().trim().isEmpty() ? null : user.getPhone3());
        user.setAddress2(user.getAddress2() == null || user.getAddress2().trim().isEmpty() ? null : user.getAddress2());

        try {
            if (profileImage != null && !profileImage.isEmpty()) {
                String originalFilename = profileImage.getOriginalFilename();

                // 파일명이 null이거나 확장자가 없는 경우 예외 처리
                if (originalFilename == null || !originalFilename.contains(".")) {
                    throw new IllegalArgumentException("유효하지 않은 파일명입니다.");
                }

                // 확장자 추출
                String extension = originalFilename.substring(originalFilename.lastIndexOf(".")).toLowerCase();

                // 허용된 확장자 목록
                if (!isAllowedExtension(extension)) {
                    throw new IllegalArgumentException("허용되지 않은 파일 형식입니다.");
                }

                // 저장할 파일명 생성
                String uniqueFileName = UUID.randomUUID().toString() + extension;

                File file = new File(UPLOAD_DIR + uniqueFileName);
                profileImage.transferTo(file);

                user.setOriginUser(originalFilename);
                user.setSysUser(uniqueFileName);
            } else {
                user.setOriginUser("default-profile.png");
                user.setSysUser("default-profile.png");
            }

            usersMapper.insertUser(user);
        } catch (IOException e) {
            log.error("파일 업로드 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("파일 업로드에 실패하였습니다.");
        } catch (Exception e) {
            log.error("회원가입 중 오류 발생: {}", e.getMessage());
            throw new RuntimeException("회원가입 중 오류가 발생했습니다.");
        }
    }

    @Override
    public Users findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("이메일은 필수 입력 사항입니다.");
        }
        return usersMapper.read(email);
    }

    /**
     * 허용된 확장자 체크
     */
    private boolean isAllowedExtension(String extension) {
        String[] allowedExtensions = {".jpg", ".jpeg", ".png", ".gif"};
        for (String allowed : allowedExtensions) {
            if (extension.equals(allowed)) {
                return true;
            }
        }
        return false;
    }
}
