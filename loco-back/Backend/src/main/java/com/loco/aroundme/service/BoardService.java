//package com.loco.aroundme.service;
//
//import com.loco.aroundme.domain.Board;
//import java.util.List;
//
//public interface BoardService {
//	/** ✅ 게시글 저장 */
//	void createBoard(Board board);
//
//	/** ✅ JSON 데이터를 Board 객체로 변환 */
//	Board convertJsonToBoard(String postJson, String imageUrl) throws Exception;
//
//	/** ✅ 특정 게시판 유형(report, notice 등)의 게시글 목록 조회 (추가) */
//	List<Board> getBoardsByType(String type);
//
//	Board getBoardById(String type, Long id);
//
//	void increaseViews(Long id); // ✅ 조회수 증가
//
//
//}
package com.loco.aroundme.service;

import java.util.List;

import com.loco.aroundme.domain.Board;
import com.loco.aroundme.domain.BoardComment;

public interface BoardService {
	/** ✅ 게시글 저장 */
	void createBoard(Board board);

	/** ✅ JSON 데이터를 Board 객체로 변환 */
	Board convertJsonToBoard(String postJson, String imageUrl) throws Exception;

	/** ✅ 특정 게시판 유형(report, notice 등)의 게시글 목록 조회 (추가) */
	List<Board> getBoardsByType(String type);

	/** 특정 게시글 조회 */
	Board getBoardById(String type, Long id);

	/** 조회수 증가 */
	void increaseViews(Long id);

	/** 특정 게시글의 댓글 조회 */
	List<BoardComment> getCommentsByBoardId(Long boardId);

    /** ✅ 게시글 수정 */
    void updateBoard(String type, Long boardId, Board board);


    /** 댓글 등록 (userId 사용) */
    BoardComment addComment(Long boardId, BoardComment comment);

    /** 댓글 수정 */
    BoardComment updateComment(Long commentId, BoardComment comment);

    /** 댓글 삭제 */
    void deleteComment(Long commentId);

	/** 게시글 삭제 */
	void deleteBoard(String type, Long id);
	
}