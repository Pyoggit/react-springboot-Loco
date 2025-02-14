package com.loco.aroundme.service;

import com.loco.aroundme.domain.Board;

public interface BoardService {
	/** ✅ 게시글 저장 */
    void createBoard(Board board);

    /** ✅ JSON 데이터를 Board 객체로 변환 */
    Board convertJsonToBoard(String postJson, String imageUrl) throws Exception;
}
