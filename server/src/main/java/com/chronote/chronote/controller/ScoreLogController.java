package com.chronote.chronote.controller;

import com.chronote.chronote.service.ScoreLogService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scorelog")
@RequiredArgsConstructor
public class ScoreLogController {

    private final ScoreLogService scoreLogService;

    private Claims getClaims() {
        return (Claims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getLogs() {
        return ResponseEntity.ok(scoreLogService.getLogs(getClaims()));
    }

    @GetMapping("/daily")
    public ResponseEntity<List<Map<String, Object>>> getDailyScore() {
        return ResponseEntity.ok(scoreLogService.getDailyScore(getClaims()));
    }
}