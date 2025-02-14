package com.loco.aroundme.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loco.aroundme.domain.Board;
import com.loco.aroundme.mapper.BoardMapper;

@Service
public class BoardServiceImpl implements BoardService {

	@Autowired
    private BoardMapper boardMapper;

    @Autowired
    private ObjectMapper objectMapper; // JSON 변환을 위한 ObjectMapper

    /** ✅ 게시글 등록 */
    @Override
    public void createBoard(Board board) {
        board.setBoardRegdate(new Date()); // 현재 날짜 설정
        board.setViews(0L); // 조회수 초기화
        boardMapper.insertBoard(board);
    }

    /** ✅ JSON 데이터를 Board 객체로 변환 */
    @Override
    public Board convertJsonToBoard(String postJson, String imageUrl) throws Exception {
        Board board = objectMapper.readValue(postJson, Board.class);
        board.setBoardRegdate(new Date()); // 현재 날짜
        board.setViews(0L); // 조회수 초기화
        board.setPictureUrl(imageUrl); // 이미지 URL 추가
        return board;
    }
}