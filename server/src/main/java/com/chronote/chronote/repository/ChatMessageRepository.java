// 📁 src/main/java/com/chronote/chronote/repository/ChatMessageRepository.java

package com.chronote.chronote.repository;

import com.chronote.chronote.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;  // ✅ MongoRepository로 명확히
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByRoomIdOrderByTimestampAsc(String roomId);
}