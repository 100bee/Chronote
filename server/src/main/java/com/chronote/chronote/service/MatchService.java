// 📁 src/main/java/com/chronote/chronote/service/MatchService.java

package com.chronote.chronote.service;

import com.chronote.chronote.dto.MatchDto;
import com.chronote.chronote.entity.ChatRoom;
import com.chronote.chronote.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchService {

    private final RestTemplate restTemplate;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatService chatService;

    private static final String FASTAPI_URL = "http://localhost:8000";

    public MatchDto.MatchResult findMatch(String userText) {
        // 현재 모든 채팅방 가져오기
        List<ChatRoom> allRooms = chatRoomRepository.findAll();

        // FastAPI 요청 형식으로 변환
        List<MatchDto.ChatRoomInfo> roomInfos = allRooms.stream()
                .map(r -> new MatchDto.ChatRoomInfo(r.getRoomId(), r.getTitle()))
                .collect(Collectors.toList());

        MatchDto.MatchRequest request = new MatchDto.MatchRequest(
                userText, roomInfos, 0.5
        );

        try {
            // FastAPI 호출
            MatchDto.MatchResult result = restTemplate.postForObject(
                    FASTAPI_URL + "/match-group-advanced",
                    request,
                    MatchDto.MatchResult.class
            );

            // 매칭 실패 시 새 채팅방 생성
            if (result != null && result.getBest_match_room_id() == null) {
                log.info("[MATCH] 유사한 방 없음 → 새 채팅방 생성: {}", userText);
                ChatRoom newRoom = chatService.createRoom(userText);
                return new MatchDto.MatchResult(
                        newRoom.getRoomId(),
                        null,
                        "새 채팅방이 생성되었습니다: " + newRoom.getTitle()
                );
            }

            return result;

        } catch (Exception e) {
            log.error("[MATCH] FastAPI 호출 실패: {}", e.getMessage());
            throw new RuntimeException("AI 매칭 서버 오류");
        }
    }
}