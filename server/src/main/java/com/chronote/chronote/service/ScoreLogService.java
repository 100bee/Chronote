package com.chronote.chronote.service;

import com.chronote.chronote.entity.ScoreLog;
import com.chronote.chronote.repository.ScoreLogRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ScoreLogService {

    private final ScoreLogRepository scoreLogRepository;

    private Long getUserId(Claims claims) {
        return ((Number) claims.get("id")).longValue();
    }

    public void addLog(Long userId, int scoreChange, String reason) {
        ScoreLog log = ScoreLog.builder()
                .userId(userId)
                .scoreChange(scoreChange)
                .reason(reason)
                .build();
        scoreLogRepository.save(log);
    }

    public List<Map<String, Object>> getLogs(Claims claims) {
        Long userId = getUserId(claims);
        List<ScoreLog> logs = scoreLogRepository.findTop20ByUserIdOrderByCreatedAtDesc(userId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (ScoreLog log : logs) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("score_change", log.getScoreChange());
            map.put("reason", log.getReason());
            map.put("created_at", log.getCreatedAt());
            result.add(map);
        }
        return result;
    }

    public List<Map<String, Object>> getDailyScore(Claims claims) {
        Long userId = getUserId(claims);
        List<Object[]> rows = scoreLogRepository.findDailyScoreByUserId(userId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("date", row[0].toString());
            map.put("daily_score", row[1]);
            result.add(map);
        }
        return result;
    }
}