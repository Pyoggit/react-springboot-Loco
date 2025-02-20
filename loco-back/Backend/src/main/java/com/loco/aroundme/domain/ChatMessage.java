package com.loco.aroundme.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    private Long senderId;     // 보낸 사람 ID
    private String senderName; // 보낸 사람 이름
    private String content;    // 메시지 내용
    private String type;       // 메시지 타입 (JOIN, TALK, LEAVE)
    private Long roomId;       // 채팅방 ID
}
