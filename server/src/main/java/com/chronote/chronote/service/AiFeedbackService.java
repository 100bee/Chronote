// 📁 src/main/java/com/chronote/chronote/service/AiFeedbackService.java

package com.chronote.chronote.service;

import com.chronote.chronote.entity.Todo;
import com.chronote.chronote.repository.TodoRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiFeedbackService {

    private final TodoRepository todoRepository;
    private final RestTemplate restTemplate;

    @Value("${openai.api-key}")
    private String openaiApiKey;

    @Value("${openai.model:gpt-4.1-mini}")
    private String model;

    private Long getUserId(Claims claims) {
        return ((Number) claims.get("id")).longValue();
    }

    public Map<String, Object> generateFeedback(Claims claims) {
        Long userId = getUserId(claims);
        LocalDate today = LocalDate.now();

        // ✅ 오늘 투두 목록 가져오기
        List<Todo> todos = todoRepository.findByUserIdAndDueDate(userId, today);

        if (todos.isEmpty()) {
            return Map.of(
                    "feedback", "오늘 등록된 할 일이 없어요! 내일은 계획을 세워보세요. 💪",
                    "stats", Map.of("total", 0, "completed", 0, "completionRate", 0)
            );
        }

        long completed = todos.stream().filter(t -> t.getIsCompleted() == 1).count();
        long totalDuration = todos.stream().mapToLong(Todo::getDuration).sum();
        double completionRate = (double) completed / todos.size() * 100;

        // ✅ 완료된 투두 내용 요약
        String completedTodos = todos.stream()
                .filter(t -> t.getIsCompleted() == 1)
                .map(t -> String.format("- %s (소요: %d분)", t.getContent(), t.getDuration() / 60))
                .collect(Collectors.joining("\n"));

        String incompleteTodos = todos.stream()
                .filter(t -> t.getIsCompleted() == 0)
                .map(t -> "- " + t.getContent())
                .collect(Collectors.joining("\n"));

        // ✅ GPT 프롬프트 구성
        String prompt = String.format("""
                당신은 학습 코치입니다. 사용자의 오늘 공부 기록을 분석해 따뜻하고 동기부여가 되는 피드백을 작성해주세요.
                
                [오늘의 공부 기록]
                - 전체 할 일: %d개
                - 완료한 할 일: %d개
                - 완료율: %.1f%%
                - 총 공부 시간: %d분
                
                [완료한 항목]
                %s
                
                [미완료 항목]
                %s
                
                다음 형식으로 응답해주세요 (마크다운 사용):
                
                ## 오늘의 공부 요약
                (오늘 성과를 2-3문장으로 칭찬과 함께 요약)
                
                ## 잘한 점 ✨
                (구체적으로 칭찬 2가지)
                
                ## 개선할 점 💡
                (부드럽게 1-2가지 조언)
                
                ## 내일 추천 계획 📅
                (미완료 항목 기반으로 내일 우선순위 추천 2-3가지)
                
                ## 응원 메시지 💪
                (짧고 강렬한 동기부여 한 마디)
                """,
                todos.size(), completed, completionRate,
                totalDuration / 60,
                completedTodos.isEmpty() ? "없음" : completedTodos,
                incompleteTodos.isEmpty() ? "없음" : incompleteTodos
        );

        // ✅ OpenAI API 호출
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(openaiApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("max_tokens", 1000);
            requestBody.put("messages", List.of(
                    Map.of("role", "user", "content", prompt)
            ));

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.openai.com/v1/chat/completions",
                    entity,
                    Map.class
            );

            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            String feedback = (String) message.get("content");

            return Map.of(
                    "feedback", feedback,
                    "stats", Map.of(
                            "total", todos.size(),
                            "completed", completed,
                            "completionRate", Math.round(completionRate),
                            "totalMinutes", totalDuration / 60
                    )
            );

        } catch (Exception e) {
            log.error("OpenAI API 호출 실패: {}", e.getMessage());
            throw new RuntimeException("AI 피드백 생성 실패: " + e.getMessage());
        }
    }
}