package com.loco.aroundme.service;

import com.loco.aroundme.domain.ChatMessage;
import com.loco.aroundme.domain.ChatRoom;
import java.util.List;

public interface ChatService {
    void createChatRoom(String roomName, int createdBy); // 채팅방 생성
    ChatRoom findRoomById(int roomId); // 특정 채팅방 조회
    List<ChatRoom> findAllRooms(); // 모든 채팅방 조회
    void saveMessage(int roomId, int senderId, String messageContent, String messageType); // 메시지 저장
    List<ChatMessage> findMessagesByRoomId(int roomId); // 특정 채팅방의 모든 메시지 조회
}
