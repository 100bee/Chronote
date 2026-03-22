// 📁 src/main/java/com/chronote/chronote/dto/ChatDto.java

package com.chronote.chronote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatDto {
    private String roomId;
    private String sender;
    private String message;
}