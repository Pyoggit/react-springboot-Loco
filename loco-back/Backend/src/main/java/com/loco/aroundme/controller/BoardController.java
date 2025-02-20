package com.loco.aroundme.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.loco.aroundme.domain.Board;
import com.loco.aroundme.domain.BoardComment;
import com.loco.aroundme.service.BoardService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/board")
@CrossOrigin(origins = "http://localhost:5173") // 프론트엔드 연동을 위한 CORS 설정
public class BoardController {
	@Autowired
	private BoardService boardService;

	/** ✅ 게시글 등록 */
	@PostMapping("/new")
	public ResponseEntity<String> createBoard(@RequestPart("post") String postJson) {
		try {
			log.info("📌 게시글 등록 요청 수신 - postJson: {}", postJson);
			// 파일 업로드 기능 제거: convertJsonToBoard는 이제 postJson만 받음
			Board board = boardService.convertJsonToBoard(postJson);
			log.info("✅ 게시글 JSON 변환 완료 - 제목: {}, 작성자: {}", board.getTitle(), board.getUserId());
			// 게시글 저장
			boardService.createBoard(board);
			log.info("✅ 게시글 저장 완료 - ID: {}", board.getBoardId());
			return ResponseEntity.ok("게시글 등록 성공");
		} catch (Exception e) {
			log.error("❌ 게시글 등록 중 오류 발생: {}", e.getMessage(), e);
			return ResponseEntity.badRequest().body("게시글 등록 실패: " + e.getMessage());
		}
	}

	/** ✅ 게시글 수정 */
	@PutMapping("/{type}/{id}")
	public ResponseEntity<String> updateBoard(@PathVariable String type, @PathVariable Long id,
	        @RequestBody String postJson) {
		try {
			log.info("📌 게시글 수정 요청: {}", postJson);
			// 파일 업로드 기능 제거: convertJsonToBoard는 이제 postJson만 받음
			Board board = boardService.convertJsonToBoard(postJson);
			boardService.updateBoard(type, id, board);
			return ResponseEntity.ok("게시글 수정 성공");
		} catch (Exception e) {
			log.error("❌ 게시글 수정 중 오류 발생: {}", e.getMessage());
			return ResponseEntity.badRequest().body("게시글 수정 실패: " + e.getMessage());
		}
	}

	/** ✅ 특정 게시판 유형의 게시글 목록 조회 (추가) */
	@GetMapping("/{type}")
	public List<Board> getBoardByType(@PathVariable String type) {
		return boardService.getBoardsByType(type);
	}

	/**
	 * 특정 게시글 조회 (글보기) - 댓글 목록 포함 응답 구조: { "board": { ... }, "comments": [ ... ] }
	 */
	@GetMapping("/{type}/{id}")
	public ResponseEntity<?> getBoardById(@PathVariable String type, @PathVariable Long id) {
		Board board = boardService.getBoardById(type, id);
		if (board == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
		}
		Map<String, Object> result = new HashMap<>();
		result.put("board", board);
		result.put("comments", boardService.getCommentsByBoardId(id));
		return ResponseEntity.ok(result);
	}

	/** 조회수 증가 API (POST 방식 사용) */
	@PostMapping("/{type}/{id}/views")
	public ResponseEntity<?> increaseViews(@PathVariable String type, @PathVariable Long id) {
		boardService.increaseViews(id);
		return ResponseEntity.ok("조회수 증가 성공");
	}

	/** 댓글 등록 (userId 사용) */
	@PostMapping("/{type}/{id}/comments")
	public ResponseEntity<?> addComment(@PathVariable String type, @PathVariable Long id,
			@RequestBody BoardComment comment) {
		try {
			// 클라이언트가 JSON에 userId와 content를 포함해서 보낸다고 가정
			if (comment.getUserId() == null) {
				return ResponseEntity.badRequest().body("댓글 등록 시 userId가 필요합니다.");
			}
			BoardComment savedComment = boardService.addComment(id, comment);
			return ResponseEntity.ok(savedComment);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 등록 실패: " + e.getMessage());
		}
	}

	/** 댓글 수정 */
	@PutMapping("/{type}/comments/{commentId}")
	public ResponseEntity<?> updateComment(@PathVariable String type, @PathVariable Long commentId,
			@RequestBody BoardComment comment) {
		try {
			BoardComment updatedComment = boardService.updateComment(commentId, comment);
			return ResponseEntity.ok(updatedComment);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 수정 실패: " + e.getMessage());
		}
	}

	/** 댓글 삭제 */
	@DeleteMapping("/{type}/comments/{commentId}")
	public ResponseEntity<?> deleteComment(@PathVariable String type, @PathVariable Long commentId) {
		try {
			boardService.deleteComment(commentId);
			return ResponseEntity.ok("댓글 삭제 성공");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 삭제 실패: " + e.getMessage());
		}
	}

	@DeleteMapping("/{type}/{id}")
	public ResponseEntity<?> deleteBoard(@PathVariable String type, @PathVariable Long id) {
		try {
			boardService.deleteBoard(type, id);
			return ResponseEntity.ok("게시글 삭제 성공");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 삭제 실패: " + e.getMessage());
		}
	}
}



//package com.loco.aroundme.controller;
//
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestPart;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.loco.aroundme.domain.Board;
//import com.loco.aroundme.domain.BoardComment;
//import com.loco.aroundme.service.BoardService;
//import com.loco.aroundme.service.FileService;
//
//import lombok.extern.slf4j.Slf4j;
//
//@Slf4j
//@RestController
//@RequestMapping("/api/board")
//@CrossOrigin(origins = "http://localhost:5173") // 프론트엔드 연동을 위한 CORS 설정
//public class BoardController {
//	@Autowired
//	private BoardService boardService;
//	@Autowired
//	private FileService fileService;
//
//	/** ✅ 게시글 등록 */
//	@PostMapping("/new")
//	public ResponseEntity<String> createBoard(@RequestPart("post") String postJson,
//			@RequestPart(value = "image", required = false) MultipartFile image) {
//		try {
//			log.info("📌 게시글 등록 요청 수신 - postJson: {}", postJson);
//			String imageUrl = null;
//			// ✅ 이미지 저장 후 URL 반환
//			if (image != null && !image.isEmpty()) {
//				log.info("📌 이미지 업로드 요청됨 - 파일명: {}", image.getOriginalFilename());
//				imageUrl = fileService.saveFile(image);
//				log.info("✅ 이미지 저장 완료 - 저장된 URL: {}", imageUrl);
//			} else {
//				log.info("📌 이미지 업로드 없음");
//			}
//			// ✅ JSON을 Board 객체로 변환
//			Board board = boardService.convertJsonToBoard(postJson, imageUrl);
//			log.info("✅ 게시글 JSON 변환 완료 - 제목: {}, 작성자: {}", board.getTitle(), board.getUserId());
//			// ✅ 게시글 저장
//			boardService.createBoard(board);
//			log.info("✅ 게시글 저장 완료 - ID: {}", board.getBoardId());
//			return ResponseEntity.ok("게시글 등록 성공");
//		} catch (Exception e) {
//			log.error("❌ 게시글 등록 중 오류 발생: {}", e.getMessage(), e);
//			return ResponseEntity.badRequest().body("게시글 등록 실패: " + e.getMessage());
//		}
//	}
//
//	/** ✅ 게시글 수정 */
//	@PutMapping("/{type}/{id}")
//	public ResponseEntity<String> updateBoard(@PathVariable String type, @PathVariable Long id,
//			@RequestPart("post") String postJson, @RequestPart(value = "image", required = false) MultipartFile image) {
//		try {
//			log.info("📌 게시글 수정 요청: {}", postJson);
//			String imageUrl = null;
//
//			// 이미지가 새로 업로드되었을 경우 저장
//			if (image != null && !image.isEmpty()) {
//				imageUrl = fileService.saveFile(image);
//				log.info("✅ 새 이미지 저장 완료: {}", imageUrl);
//			}
//
//			// JSON을 Board 객체로 변환 후 수정
//			Board board = boardService.convertJsonToBoard(postJson, imageUrl);
//			boardService.updateBoard(type, id, board);
//			return ResponseEntity.ok("게시글 수정 성공");
//		} catch (Exception e) {
//			log.error("❌ 게시글 수정 중 오류 발생: {}", e.getMessage());
//			return ResponseEntity.badRequest().body("게시글 수정 실패: " + e.getMessage());
//		}
//	}
//
//	/** ✅ 특정 게시판 유형의 게시글 목록 조회 (추가) */
//	@GetMapping("/{type}")
//	public List<Board> getBoardByType(@PathVariable String type) {
//		return boardService.getBoardsByType(type);
//	}
//
//	/**
//	 * 특정 게시글 조회 (글보기) - 댓글 목록 포함 응답 구조: { "board": { ... }, "comments": [ ... ] }
//	 */
//	@GetMapping("/{type}/{id}")
//	public ResponseEntity<?> getBoardById(@PathVariable String type, @PathVariable Long id) {
//		Board board = boardService.getBoardById(type, id);
//		if (board == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
//		}
//		Map<String, Object> result = new HashMap<>();
//		result.put("board", board);
//		result.put("comments", boardService.getCommentsByBoardId(id));
//		return ResponseEntity.ok(result);
//	}
//
//	/** 조회수 증가 API (POST 방식 사용) */
//	@PostMapping("/{type}/{id}/views")
//	public ResponseEntity<?> increaseViews(@PathVariable String type, @PathVariable Long id) {
//		boardService.increaseViews(id);
//		return ResponseEntity.ok("조회수 증가 성공");
//	}
//
//	/** 댓글 등록 (userId 사용) */
//	@PostMapping("/{type}/{id}/comments")
//	public ResponseEntity<?> addComment(@PathVariable String type, @PathVariable Long id,
//			@RequestBody BoardComment comment) {
//		try {
//			// 클라이언트가 JSON에 userId와 content를 포함해서 보낸다고 가정
//			if (comment.getUserId() == null) {
//				return ResponseEntity.badRequest().body("댓글 등록 시 userId가 필요합니다.");
//			}
//			BoardComment savedComment = boardService.addComment(id, comment);
//			return ResponseEntity.ok(savedComment);
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 등록 실패: " + e.getMessage());
//		}
//	}
//
//	/** 댓글 수정 */
//	@PutMapping("/{type}/comments/{commentId}")
//	public ResponseEntity<?> updateComment(@PathVariable String type, @PathVariable Long commentId,
//			@RequestBody BoardComment comment) {
//		try {
//			BoardComment updatedComment = boardService.updateComment(commentId, comment);
//			return ResponseEntity.ok(updatedComment);
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 수정 실패: " + e.getMessage());
//		}
//	}
//
//	/** 댓글 삭제 */
//	@DeleteMapping("/{type}/comments/{commentId}")
//	public ResponseEntity<?> deleteComment(@PathVariable String type, @PathVariable Long commentId) {
//		try {
//			boardService.deleteComment(commentId);
//			return ResponseEntity.ok("댓글 삭제 성공");
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("댓글 삭제 실패: " + e.getMessage());
//		}
//	}
//
//	@DeleteMapping("/{type}/{id}")
//	public ResponseEntity<?> deleteBoard(@PathVariable String type, @PathVariable Long id) {
//		try {
//			boardService.deleteBoard(type, id);
//			return ResponseEntity.ok("게시글 삭제 성공");
//		} catch (Exception e) {
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("게시글 삭제 실패: " + e.getMessage());
//		}
//	}
//}
//
