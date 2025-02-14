package com.loco.aroundme.mapper;

import com.loco.aroundme.domain.Board;
import com.loco.aroundme.domain.BoardComment;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface BoardMapper {
    
    // ✅ 게시글 등록
    void insertBoard(Board board);
}
