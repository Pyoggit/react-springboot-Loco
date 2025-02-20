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

    @GetMapping("/room/{roomId}/messages")
    public List<ChatMessage> getMessagesByRoom(@PathVariable Long roomId) {
        return chatService.findMessagesByRoomId(roomId);
    }

    @PostMapping("/room/{roomId}/message")
    public void saveMessage(@PathVariable Long roomId, 
                            @RequestParam Long senderId, 
                            @RequestParam String senderName,
                            @RequestParam String messageContent, 
                            @RequestParam String messageType) {
        log.info("📩 메시지 저장 요청: roomId={}, senderId={}, senderName={}, content={}", 
                 roomId, senderId, senderName, messageContent);
        chatService.saveMessage(roomId, senderId, senderName, messageContent, messageType);
    }
}
