// 📁 src/main/java/com/chronote/chronote/entity/ChatMessage.java

package com.chronote.chronote.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "messages")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    private String id;

    private String roomId;
    private String sender;
    private String message;
    private LocalDateTime timestamp;
}