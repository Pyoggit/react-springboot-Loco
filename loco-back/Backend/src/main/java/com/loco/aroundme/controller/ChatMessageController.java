package com.loco.aroundme.controller;

import com.loco.aroundme.domain.ChatMessage;
import com.loco.aroundme.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatMessageController {

    private final ChatService chatService;

    // 특정 채팅방의 모든 메시지 조회
    @GetMapping("/room/{roomId}/messages")
    public List<ChatMessage> getMessagesByRoom(@PathVariable int roomId) {
        return chatService.findMessagesByRoomId(roomId);
    }

    // 메시지 저장
    @PostMapping("/room/{roomId}/message")
    public void saveMessage(@PathVariable int roomId, @RequestParam int senderId, 
                            @RequestParam String messageContent, @RequestParam String messageType) {
        log.info("📩 메시지 저장 요청: roomId={}, senderId={}, content={}", roomId, senderId, messageContent);
        chatService.saveMessage(roomId, senderId, messageContent, messageType);
    }
}
