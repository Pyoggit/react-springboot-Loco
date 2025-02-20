package com.loco.aroundme.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import com.loco.aroundme.domain.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.beans.factory.annotation.Autowired;

@Slf4j
@Controller
public class ChatController {
	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@MessageMapping("/chat/send")
	public void sendMessage(ChatMessage chatMessage) {
	    log.info("Received message: {} from sender: {} in room: {}", chatMessage.getContent(), chatMessage.getSenderName(), chatMessage.getRoomId());
	    // 각 채팅방에 맞는 구독 경로로 메시지 전송
	    messagingTemplate.convertAndSend("/topic/room." + chatMessage.getRoomId(), chatMessage);
	}

}
