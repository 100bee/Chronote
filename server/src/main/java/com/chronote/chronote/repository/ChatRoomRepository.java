// 📁 src/main/java/com/chronote/chronote/repository/ChatRoomRepository.java

package com.chronote.chronote.repository;

import com.chronote.chronote.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;  // ✅ MongoRepository로 명확히
import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    Optional<ChatRoom> findByRoomId(String roomId);
    boolean existsByRoomId(String roomId);
    List<ChatRoom> findAll();
}