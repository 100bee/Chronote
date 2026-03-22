// 📁 src/main/java/com/chronote/chronote/controller/ChatController.java

package com.chronote.chronote.controller;

import com.chronote.chronote.dto.ChatDto;
import com.chronote.chronote.entity.ChatMessage;
import com.chronote.chronote.entity.ChatRoom;
import com.chronote.chronote.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // 채팅방 전체 조회
    @GetMapping("/api/chatrooms")
    public ResponseEntity<List<ChatRoom>> getAllRooms() {
        return ResponseEntity.ok(chatService.getAllRooms());
    }

    // 채팅방 단일 조회
    @GetMapping("/api/chatrooms/{roomId}")
    public ResponseEntity<ChatRoom> getRoom(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.getRoom(roomId));
    }

    // 채팅방 생성
    @PostMapping("/api/chatrooms")
    public ResponseEntity<ChatRoom> createRoom(@RequestBody Map<String, String> body) {
        String title = body.get("title");
        return ResponseEntity.status(201).body(chatService.createRoom(title));
    }

    // 메시지 조회
    @GetMapping("/api/messages/{roomId}")
    public ResponseEntity<List<ChatMessage>> getMessages(@PathVariable String roomId) {
        return ResponseEntity.ok(chatService.getMessages(roomId));
    }

    // WebSocket - 메시지 전송
    @MessageMapping("/chat/{roomId}")
    public void sendMessage(@DestinationVariable String roomId,
                            @Payload ChatDto chatDto) {
        ChatMessage saved = chatService.saveMessage(roomId, chatDto.getSender(), chatDto.getMessage());
        messagingTemplate.convertAndSend("/topic/chat/" + roomId, saved);
    }
}