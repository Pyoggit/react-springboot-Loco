package com.loco.aroundme.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.loco.aroundme.domain.ChatMessage;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class ChatController {

    @MessageMapping("/chat/send") // 클라이언트에서 보낸 메시지를 받을 엔드포인트
    @SendTo("/topic/public") // 모든 클라이언트에게 메시지 브로드캐스트
    public ChatMessage sendMessage(ChatMessage chatMessage) {
        log.info("📩 받은 메시지: {} (보낸 사람: {})", chatMessage.getContent(), chatMessage.getSender());
        return chatMessage;
    }
}
