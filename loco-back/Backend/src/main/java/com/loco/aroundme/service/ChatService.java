package com.loco.aroundme.service;

import com.loco.aroundme.domain.ChatMessage;
import com.loco.aroundme.domain.ChatRoom;
import java.util.List;

public interface ChatService {
    
    // ✅ 판매자-구매자-상품별 채팅방 생성 (중복방 확인 후 기존 방 반환)
    ChatRoom createOrGetChatRoom(Long sellerId, Long buyerId, Long productId);

    // ✅ 특정 채팅방 정보 조회
    ChatRoom findRoomById(Long roomId);

    // ✅ 특정 유저의 모든 채팅방 조회
    List<ChatRoom> findChatRoomsByUserId(Long userId);

    // ✅ 특정 채팅방의 메시지 목록 조회
    List<ChatMessage> findMessagesByRoomId(Long roomId);

    // ✅ 채팅 메시지 저장
    void saveMessage(Long roomId, Long senderId, String senderName, String messageContent, String messageType);
}
