package com.loco.aroundme.service;

import com.loco.aroundme.domain.ChatMessage;
import com.loco.aroundme.domain.ChatRoom;
import com.loco.aroundme.mapper.ChatMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatMapper chatMapper;

    @Override
    @Transactional
    public ChatRoom createOrGetChatRoom(Long sellerId, Long buyerId, Long productId) {
        ChatRoom existingRoom = chatMapper.findExistingRoom(sellerId, buyerId, productId);
        if (existingRoom != null) {
            return existingRoom;
        }
        chatMapper.createChatRoom(sellerId, buyerId, productId);
        return chatMapper.findExistingRoom(sellerId, buyerId, productId);
    }

    @Override
    public ChatRoom findRoomById(Long roomId) {
        return chatMapper.findRoomById(roomId);
    }

    @Override
    public List<ChatRoom> findChatRoomsByUserId(Long userId) {
        return chatMapper.findChatRoomsByUserId(userId);
    }

    @Override
    public List<ChatMessage> findMessagesByRoomId(Long roomId) {
        return chatMapper.findMessagesByRoomId(roomId);
    }
    
    @Override
    @Transactional
    public void deleteChatRoom(Long roomId) {
        log.info("🗑️ 채팅방 삭제: roomId={}", roomId);
        chatMapper.deleteChatRoom(roomId);
    }

    @Override
    @Transactional
    public void saveMessage(Long roomId, Long senderId, String senderName, String messageContent, String messageType) {
        chatMapper.saveMessage(roomId, senderId, senderName, messageContent, messageType);
        log.info("💾 메시지 저장 완료: Room ID={}, Sender={}, Content={}", roomId, senderName, messageContent);
    }
}
