package com.loco.aroundme.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.loco.aroundme.domain.ChatRoom;
import com.loco.aroundme.domain.ChatRoomRequest;
import com.loco.aroundme.service.ChatService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ChatRoomController {
	private final ChatService chatService;

	@PostMapping("/room")
	public ResponseEntity<ChatRoom> createOrGetChatRoom(@RequestBody ChatRoomRequest request) {
		log.info("📌 채팅방 생성 요청: sellerId={}, buyerId={}, productId={}", request.getSellerId(), request.getBuyerId(),
				request.getProductId());

		ChatRoom chatRoom = chatService.createOrGetChatRoom(request.getSellerId(), request.getBuyerId(),
				request.getProductId());

		return ResponseEntity.ok(chatRoom);
	}

	// ✅ 새로 추가: 특정 유저가 참여 중인 채팅방 목록 조회
	@GetMapping("/rooms/{userId}")
	public ResponseEntity<List<ChatRoom>> getChatRoomsByUser(@PathVariable Long userId) {
		log.info("📌 채팅방 목록 요청: userId={}", userId);
		List<ChatRoom> rooms = chatService.findChatRoomsByUserId(userId);
		return ResponseEntity.ok(rooms);
	}

}
