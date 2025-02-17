//package com.loco.aroundme.domain;
//
//import lombok.Getter;
//import lombok.Setter;
//import java.util.Date;
//
//@Getter
//@Setter
//public class Board {
//    private Long boardId;
//    private String type;
//    private String title;
//    private Long userId;
//    private String content;
//    private Long views;
//    private Date boardRegdate; // ✅ String → Date 타입으로 변경
//    private String pictureUrl;
//}
package com.loco.aroundme.domain;

import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
public class Board {
    private Long boardId;
    private String type;
    private String title;
    private Long userId;
    private String content;
    private Long views;
    private Date boardRegdate; // ✅ String → Date 타입으로 변경
    private String pictureUrl;
}