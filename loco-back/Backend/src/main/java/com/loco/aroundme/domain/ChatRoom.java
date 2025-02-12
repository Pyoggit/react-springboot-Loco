package com.loco.aroundme.domain;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatRoom {
    private int roomId;      // 채팅방 ID
    private String roomName; // 채팅방 이름
    private int createdBy;   // 채팅방 생성자 (USER_ID)
    private String createdAt; // 생성 날짜 (TIMESTAMP)
}
