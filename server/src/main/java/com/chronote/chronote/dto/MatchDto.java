// 📁 src/main/java/com/chronote/chronote/dto/MatchDto.java

package com.chronote.chronote.dto;

import lombok.*;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MatchDto {

    private String userText;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatRoomInfo {
        private String room_id;
        private String text;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchRequest {
        private String user_text;
        private List<ChatRoomInfo> chat_rooms;
        private double threshold = 0.5;
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MatchResult {
        private String best_match_room_id;
        private Double similarity_score;
        private String message;
    }
}