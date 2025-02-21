package com.loco.aroundme.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.loco.aroundme.domain.Board;
import com.loco.aroundme.domain.BoardComment;
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
	public Board convertJsonToBoard(String postJson) throws Exception {
		Board board = objectMapper.readValue(postJson, Board.class);
		board.setBoardRegdate(new Date()); // 현재 날짜
		board.setViews(0L); // 조회수 초기화
		return board;
	}

	/** ✅ 특정 게시판 유형의 게시글 목록 조회 */
	@Override
	public List<Board> getBoardsByType(String type) {
		return boardMapper.selectBoardsByType(type);
	}

	/** 특정 게시글 조회 */
	@Override
	public Board getBoardById(String type, Long id) {
		return boardMapper.selectBoardById(id);
	}

	/** ✅ 게시글 수정 */
	@Override
	public void updateBoard(String type, Long id, Board board) {
		Board existingBoard = boardMapper.selectBoardById(id);
		if (existingBoard == null) {
			throw new RuntimeException("게시글을 찾을 수 없습니다.");
		}
		board.setBoardId(id);
		boardMapper.updateBoard(board);
	}

	/** 조회수 증가 */
	@Override
	public void increaseViews(Long id) {
		boardMapper.updateViews(id);
	}

	/** 특정 게시글의 댓글 조회 */
	@Override
	public List<BoardComment> getCommentsByBoardId(Long boardId) {
		return boardMapper.selectCommentsByBoardId(boardId);
	}

	/** 댓글 등록 (userId 사용) */
	@Override
	public BoardComment addComment(Long boardId, BoardComment comment) {
		comment.setBoardId(boardId);
		comment.setRegdate(new Date());
		boardMapper.insertComment(comment);
		return comment;
	}

	/** 댓글 수정 */
	@Override
	public BoardComment updateComment(Long commentId, BoardComment comment) {
		comment.setCommentId(commentId);
		boardMapper.updateComment(comment);
		return boardMapper.selectCommentById(commentId);
	}

	/** 댓글 삭제 */
	@Override
	public void deleteComment(Long commentId) {
		boardMapper.deleteComment(commentId);
	}

	@Override
	public void deleteBoard(String type, Long id) {
		boardMapper.deleteBoard(id);
	}

	@Override
	public List<Board> getAllBoards() {
		return boardMapper.selectAllBoards();
	}

	@Override
	@Transactional
	public void deleteBoards(List<Long> boardIds) {
		boardMapper.deleteBoards(boardIds);
	}
	
	@Override
	public List<BoardComment> getAllComments() {
	    return boardMapper.selectAllComments();
	}

	@Override
	@Transactional
	public void deleteComments(List<Long> commentIds) {
	    boardMapper.deleteComments(commentIds);
	}


}

//package com.loco.aroundme.service;
//
//import java.util.Date;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.loco.aroundme.domain.Board;
//import com.loco.aroundme.domain.BoardComment;
//import com.loco.aroundme.mapper.BoardMapper;
//
//@Service
//public class BoardServiceImpl implements BoardService {
//	@Autowired
//	private BoardMapper boardMapper;
//
//	@Autowired
//	private ObjectMapper objectMapper; // JSON 변환을 위한 ObjectMapper
//
//	/** ✅ 게시글 등록 */
//	@Override
//	public void createBoard(Board board) {
//		board.setBoardRegdate(new Date()); // 현재 날짜 설정
//		board.setViews(0L); // 조회수 초기화
//		boardMapper.insertBoard(board);
//	}
//
//	/** ✅ JSON 데이터를 Board 객체로 변환 */
//	@Override
//	public Board convertJsonToBoard(String postJson, String imageUrl) throws Exception {
//		Board board = objectMapper.readValue(postJson, Board.class);
//		board.setBoardRegdate(new Date()); // 현재 날짜
//		board.setViews(0L); // 조회수 초기화
//		board.setPictureUrl(imageUrl); // 이미지 URL 추가
//		return board;
//	}
//
//	/** ✅ 특정 게시판 유형의 게시글 목록 조회 */
//	@Override
//	public List<Board> getBoardsByType(String type) {
//		return boardMapper.selectBoardsByType(type);
//	}
//
//	/** 특정 게시글 조회 */
//	@Override
//	public Board getBoardById(String type, Long id) {
//		return boardMapper.selectBoardById(id);
//	}
//
//	/** ✅ 게시글 수정 */
//	@Override
//	public void updateBoard(String type, Long id, Board board) {
//		Board existingBoard = boardMapper.selectBoardById(id);
//
//		if (existingBoard == null) {
//			throw new RuntimeException("게시글을 찾을 수 없습니다.");
//		}
//
//		// 새로운 이미지가 업로드되지 않았다면 기존 이미지 유지
//		if (board.getPictureUrl() == null) {
//			board.setPictureUrl(existingBoard.getPictureUrl());
//		}
//
//		board.setBoardId(id);
//		boardMapper.updateBoard(board);
//	}
//
//	/** 조회수 증가 */
//	@Override
//	public void increaseViews(Long id) {
//		boardMapper.updateViews(id);
//	}
//
//	/** 특정 게시글의 댓글 조회 */
//	@Override
//	public List<BoardComment> getCommentsByBoardId(Long boardId) {
//		return boardMapper.selectCommentsByBoardId(boardId);
//	}
//
//	/** 댓글 등록 (userId 사용) */
//	@Override
//	public BoardComment addComment(Long boardId, BoardComment comment) {
//		comment.setBoardId(boardId);
//		comment.setRegdate(new Date());
//		boardMapper.insertComment(comment);
//		return comment;
//	}
//
//	/** 댓글 수정 */
//	@Override
//	public BoardComment updateComment(Long commentId, BoardComment comment) {
//		comment.setCommentId(commentId);
//		boardMapper.updateComment(comment);
//		return boardMapper.selectCommentById(commentId);
//	}
//
//	/** 댓글 삭제 */
//	@Override
//	public void deleteComment(Long commentId) {
//		boardMapper.deleteComment(commentId);
//	}
//
//	@Override
//	public void deleteBoard(String type, Long id) {
//		// type 값은 필요에 따라 추가 검증이나 로깅에 활용할 수 있습니다.
//		boardMapper.deleteBoard(id);
//	}
//
//}
//
//
//
//
//
