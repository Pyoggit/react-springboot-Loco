package com.loco.aroundme.domain;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Board {
    private Long boardId;           // 게시글 ID
    private String type;            // 게시판 타입 (공지사항, 자유게시판, 신고, qna, faq, 불편&개선 등)
    private String title;           // 게시글 제목
    private Long userId;            // 작성자 ID
    private String content;         // 게시글 내용
    private Long views;             // 조회수
    private Date boardRegdate;      // 게시글 작성일
    private String pictureUrl;      // 이미지URL
}
