// 📁 src/main/java/com/chronote/chronote/controller/AiFeedbackController.java

package com.chronote.chronote.controller;

import com.chronote.chronote.service.AiFeedbackService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiFeedbackController {

    private final AiFeedbackService aiFeedbackService;

    private Claims getClaims() {
        return (Claims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // POST /api/ai/feedback - 오늘의 AI 피드백 생성
    @PostMapping("/feedback")
    public ResponseEntity<Map<String, Object>> getFeedback() {
        return ResponseEntity.ok(aiFeedbackService.generateFeedback(getClaims()));
    }
}