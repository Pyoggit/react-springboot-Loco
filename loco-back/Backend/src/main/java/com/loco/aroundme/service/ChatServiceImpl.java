package com.loco.aroundme.service;

import com.loco.aroundme.domain.ChatMessage;
import com.loco.aroundme.domain.ChatRoom;
import com.loco.aroundme.mapper.ChatMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatServiceImpl implements ChatService {

    private final ChatMapper chatMapper;
    private final SqlSession sqlSession;

    @Override
    @Transactional
    public void createChatRoom(String roomName, int createdBy) {
        chatMapper.createChatRoom(roomName, createdBy);
        log.info("채팅방 생성 완료: {}", roomName);
    }

    @Override
    public ChatRoom findRoomById(int roomId) {
        return chatMapper.findRoomById(roomId);
    }

    @Override
    public List<ChatRoom> findAllRooms() {
        return chatMapper.findAllRooms();
    }

    @Override
    @Transactional
    public void saveMessage(int roomId, int senderId, String messageContent, String messageType) {
        chatMapper.saveMessage(roomId, senderId, messageContent, messageType);
        log.info("메시지 저장 완료: Room ID={}, Sender ID={}, Content={}", roomId, senderId, messageContent);
    }

    @Override
    public List<ChatMessage> findMessagesByRoomId(int roomId) {
        return chatMapper.findMessagesByRoomId(roomId);
    }
}
