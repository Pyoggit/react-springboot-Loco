package com.loco.aroundme.controller;

import com.loco.aroundme.domain.Board;
import com.loco.aroundme.service.BoardService;
import com.loco.aroundme.service.FileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequestMapping("/api/board")
@CrossOrigin(origins = "http://localhost:5173") // 프론트엔드 연동을 위한 CORS 설정
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private FileService fileService;

    /** ✅ 게시글 등록 */
    @PostMapping("/new")
    public ResponseEntity<String> createBoard(
            @RequestPart("post") String postJson,
            @RequestPart(value = "image", required = false) MultipartFile image) {

        try {
            log.info("📌 게시글 등록 요청 수신 - postJson: {}", postJson);

            String imageUrl = null;

            // ✅ 이미지 저장 후 URL 반환
            if (image != null && !image.isEmpty()) {
                log.info("📌 이미지 업로드 요청됨 - 파일명: {}", image.getOriginalFilename());
                imageUrl = fileService.saveFile(image);
                log.info("✅ 이미지 저장 완료 - 저장된 URL: {}", imageUrl);
            } else {
                log.info("📌 이미지 업로드 없음");
            }

            // ✅ JSON을 Board 객체로 변환
            Board board = boardService.convertJsonToBoard(postJson, imageUrl);
            log.info("✅ 게시글 JSON 변환 완료 - 제목: {}, 작성자: {}", board.getTitle(), board.getUserId());

            // ✅ 게시글 저장
            boardService.createBoard(board);
            log.info("✅ 게시글 저장 완료 - ID: {}", board.getBoardId());

            return ResponseEntity.ok("게시글 등록 성공");

        } catch (Exception e) {
            log.error("❌ 게시글 등록 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body("게시글 등록 실패: " + e.getMessage());
        }
    }
}
