package com.loco.aroundme.mapper;

import com.loco.aroundme.domain.ChatMessage;
import com.loco.aroundme.domain.ChatRoom;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface ChatMapper {

    // ✅ 기존 채팅방 조회 (판매자-구매자-상품 ID가 같은 방이 있는지 확인)
    ChatRoom findExistingRoom(@Param("sellerId") Long sellerId, 
                              @Param("buyerId") Long buyerId, 
                              @Param("productId") Long productId);

    // ✅ 특정 채팅방 조회
    ChatRoom findRoomById(@Param("roomId") Long roomId);

    // ✅ 유저가 참여한 모든 채팅방 조회
    List<ChatRoom> findChatRoomsByUserId(@Param("userId") Long userId);

    // ✅ 새로운 채팅방 생성
    void createChatRoom(@Param("sellerId") Long sellerId, 
                        @Param("buyerId") Long buyerId, 
                        @Param("productId") Long productId);

    // ✅ 특정 채팅방의 모든 메시지 조회
    List<ChatMessage> findMessagesByRoomId(@Param("roomId") Long roomId);
    
    // ✅ 채팅방 삭제
    void deleteChatRoom(@Param("roomId") Long roomId);

    // ✅ 메시지 저장 (보낸 사람 ID + 보낸 사람 이름 함께 저장)
    void saveMessage(@Param("roomId") Long roomId, 
                     @Param("senderId") Long senderId, 
                     @Param("senderName") String senderName, 
                     @Param("messageContent") String messageContent, 
                     @Param("messageType") String messageType);
}
