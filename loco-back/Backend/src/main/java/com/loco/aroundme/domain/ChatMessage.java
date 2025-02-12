package com.loco.aroundme.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    private String sender; // 보낸 사람
    private String content; // 메시지 내용
    private String type; // 메시지 타입 (JOIN, TALK, LEAVE)
}

