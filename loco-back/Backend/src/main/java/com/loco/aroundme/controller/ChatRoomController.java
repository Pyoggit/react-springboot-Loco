package com.loco.aroundme.controller;

import com.loco.aroundme.domain.ChatRoom;
import com.loco.aroundme.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
public class ChatRoomController {

    private final ChatService chatService;

    // 모든 채팅방 조회
    @GetMapping("/rooms")
    public List<ChatRoom> getAllRooms() {
        return chatService.findAllRooms();
    }

    // 특정 채팅방 조회
    @GetMapping("/room/{roomId}")
    public ChatRoom getChatRoom(@PathVariable int roomId) {
        return chatService.findRoomById(roomId);
    }

    // 채팅방 생성
    @PostMapping("/room")
    public void createChatRoom(@RequestParam String roomName, @RequestParam int createdBy) {
        log.info("🛠️ 채팅방 생성 요청: roomName={}, createdBy={}", roomName, createdBy);
        chatService.createChatRoom(roomName, createdBy);
    }
}
