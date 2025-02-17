package com.loco.aroundme.service;

import java.util.Random;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    // 인증번호 생성
    public String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 6자리 랜덤 숫자
        return String.valueOf(code);
    }

    // 인증번호 이메일 전송
    public void sendVerificationCode(String toEmail, String verificationCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("비밀번호 찾기 인증번호");
            helper.setText("인증번호: " + verificationCode);

            mailSender.send(message);
        } catch (MessagingException e) { // 수정된 부분!
            throw new RuntimeException("이메일 전송 실패", e);
        }
    }

    // 임시 비밀번호 전송
    public void sendTemporaryPassword(String toEmail, String tempPassword) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("임시 비밀번호 발급");
            helper.setText("임시 비밀번호: " + tempPassword);

            mailSender.send(message);
        } catch (MessagingException e) { // 수정된 부분!
            throw new RuntimeException("이메일 전송 실패", e);
        }
    }
}
