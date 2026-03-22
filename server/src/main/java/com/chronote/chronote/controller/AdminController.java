// 📁 src/main/java/com/chronote/chronote/controller/AdminController.java

package com.chronote.chronote.controller;

import com.chronote.chronote.config.ScoreScheduler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ScoreScheduler scoreScheduler;

    // 감점 테스트
    @PostMapping("/penalty")
    public ResponseEntity<?> testPenalty() {
        scoreScheduler.penaltyForInactivity();
        return ResponseEntity.ok(Map.of("message", "감점 실행 완료"));
    }

    // 초기화 테스트
    @PostMapping("/reset")
    public ResponseEntity<?> testReset() {
        scoreScheduler.resetAllScores();
        return ResponseEntity.ok(Map.of("message", "점수 초기화 완료"));
    }
}