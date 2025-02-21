package com.loco.aroundme.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.loco.aroundme.domain.Board;
import com.loco.aroundme.domain.BoardComment;

@Mapper
public interface BoardMapper {
	// ✅ 게시글 등록
	void insertBoard(Board board);

	// ✅ 특정 게시판 유형(report, notice 등)의 게시글 목록 조회
	List<Board> selectBoardsByType(@Param("type") String type);

	// 특정 게시글 조회
	Board selectBoardById(@Param("id") Long id);

	/** ✅ 게시글 수정 */
	void updateBoard(Board board);

	// 게시글 삭제
	void deleteBoard(@Param("id") Long id);

	// 조회수 증가
	void updateViews(@Param("id") Long id);

	// 댓글 등록
	void insertComment(BoardComment comment);

	// 특정 게시글의 댓글 조회
	List<BoardComment> selectCommentsByBoardId(@Param("boardId") Long boardId);

	// 댓글 수정
	void updateComment(BoardComment comment);

	// 단건 댓글 조회
	BoardComment selectCommentById(@Param("commentId") Long commentId);

	// 댓글 삭제
	void deleteComment(@Param("commentId") Long commentId);

	List<Board> selectAllBoards();

	int deleteBoards(List<Long> boardIds);

	List<BoardComment> selectAllComments();

	int deleteComments(List<Long> commentIds);

	/** ✅ 특정 게시판에서 특정 유저의 댓글 조회 */
	List<BoardComment> getUserCommentsByType(String type, Long userId);

	/** ✅ 특정 유저의 모든 댓글 조회 */
	List<BoardComment> getAllUserComments(Long userId);

	/** ✅ 특정 게시판에서 특정 유저가 작성한 댓글 조회 */
	List<BoardComment> selectUserCommentsByType(@Param("type") String type, @Param("userId") Long userId);

	/** ✅ 특정 유저가 작성한 모든 댓글 조회 */
	List<BoardComment> selectAllUserComments(@Param("userId") Long userId);

}

//package com.loco.aroundme.mapper;
//
//import java.util.List;
//
//import org.apache.ibatis.annotations.Mapper;
//import org.apache.ibatis.annotations.Param;
//
//import com.loco.aroundme.domain.Board;
//import com.loco.aroundme.domain.BoardComment;
//
//@Mapper
//public interface BoardMapper {
//	// ✅ 게시글 등록
//	void insertBoard(Board board);
//
//	// ✅ 특정 게시판 유형(report, notice 등)의 게시글 목록 조회
//	List<Board> selectBoardsByType(@Param("type") String type);
//
//	// 특정 게시글 조회
//	Board selectBoardById(@Param("id") Long id);
//
//	/** ✅ 게시글 수정 */
//    void updateBoard(Board board);
//
//	// 게시글 삭제
//	void deleteBoard(@Param("id") Long id);
//
//	// 조회수 증가
//	void updateViews(@Param("id") Long id);
//
//	 // 댓글 등록
//    void insertComment(BoardComment comment);
//
//    // 특정 게시글의 댓글 조회
//    List<BoardComment> selectCommentsByBoardId(@Param("boardId") Long boardId);
//
//    // 댓글 수정
//    void updateComment(BoardComment comment);
//
//    // 단건 댓글 조회
//    BoardComment selectCommentById(@Param("commentId") Long commentId);
//
//    // 댓글 삭제
//    void deleteComment(@Param("commentId") Long commentId);
//}