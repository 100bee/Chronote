// 📁 src/main/java/com/chronote/chronote/service/ChatService.java

package com.chronote.chronote.service;

import com.chronote.chronote.entity.ChatMessage;
import com.chronote.chronote.entity.ChatRoom;
import com.chronote.chronote.repository.ChatMessageRepository;
import com.chronote.chronote.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;

    // 채팅방 전체 조회
    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }

    // 채팅방 단일 조회
    public ChatRoom getRoom(String roomId) {
        return chatRoomRepository.findByRoomId(roomId)
                .orElseThrow(() -> new RuntimeException("채팅방을 찾을 수 없습니다."));
    }

    // 채팅방 생성
    public ChatRoom createRoom(String title) {
        String roomId = UUID.randomUUID().toString();
        ChatRoom room = ChatRoom.builder()
                .roomId(roomId)
                .title(title)
                .createdAt(LocalDateTime.now())
                .build();
        return chatRoomRepository.save(room);
    }

    // 메시지 저장
    public ChatMessage saveMessage(String roomId, String sender, String message) {
        ChatMessage chatMessage = ChatMessage.builder()
                .roomId(roomId)
                .sender(sender)
                .message(message)
                .timestamp(LocalDateTime.now())
                .build();
        return chatMessageRepository.save(chatMessage);
    }

    // 메시지 조회
    public List<ChatMessage> getMessages(String roomId) {
        return chatMessageRepository.findByRoomIdOrderByTimestampAsc(roomId);
    }
}