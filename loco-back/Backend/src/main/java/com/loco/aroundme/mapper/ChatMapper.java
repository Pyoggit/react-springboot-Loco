package com.loco.aroundme.mapper;

import com.loco.aroundme.domain.ChatMessage;
import com.loco.aroundme.domain.ChatRoom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ChatMapper {
    // 모든 채팅방 조회
    List<ChatRoom> findAllRooms();

    // 특정 채팅방 조회
    ChatRoom findRoomById(@Param("roomId") int roomId);

    // 채팅방 생성
    void createChatRoom(@Param("roomName") String roomName, @Param("createdBy") int createdBy);

    // 특정 채팅방의 모든 메시지 조회
    List<ChatMessage> findMessagesByRoomId(@Param("roomId") int roomId);

    // 채팅 메시지 저장
    void saveMessage(@Param("roomId") int roomId,
                     @Param("senderId") int senderId,
                     @Param("messageContent") String messageContent,
                     @Param("messageType") String messageType);
}
