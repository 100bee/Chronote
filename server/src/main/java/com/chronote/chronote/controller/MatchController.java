// 📁 src/main/java/com/chronote/chronote/controller/MatchController.java

package com.chronote.chronote.controller;

import com.chronote.chronote.dto.MatchDto;
import com.chronote.chronote.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/match")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    // POST /api/match - AI 채팅방 매칭
    @PostMapping
    public ResponseEntity<MatchDto.MatchResult> findMatch(
            @RequestBody Map<String, String> body) {
        String userText = body.get("userText");
        return ResponseEntity.ok(matchService.findMatch(userText));
    }
}