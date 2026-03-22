// 📁 src/main/java/com/chronote/chronote/entity/ChatRoom.java

package com.chronote.chronote.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "chatrooms")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    private String id;

    private String roomId;
    private String title;
    private LocalDateTime createdAt;

    @Builder.Default
    private LocalDateTime expiresAt = LocalDateTime.now().plusHours(12); // 12시간 TTL
}