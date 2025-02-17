//package com.loco.aroundme.domain;
//
//import lombok.Data;
//import lombok.Builder;
//import lombok.NoArgsConstructor;
//import lombok.AllArgsConstructor;
//import java.util.Date;
//
//@Data
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class BoardComment {
//	private Long commentId;  // 댓글의 고유 ID
//    private Long boardId;    // 해당 댓글이 속한 게시글의 ID
//    private Long userId;     // 댓글 작성자의 ID
//    private String content;  // 댓글 내용
//    private Date regdate;    // 댓글 작성일
//}
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
public class BoardComment {
	private Long commentId;  // 댓글의 고유 ID
    private Long boardId;    // 해당 댓글이 속한 게시글의 ID
    private Long userId;     // 댓글 작성자의 ID
    private String content;  // 댓글 내용
    private Date regdate;    // 댓글 작성일
}