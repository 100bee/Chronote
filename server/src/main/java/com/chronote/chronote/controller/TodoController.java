// 📁 src/main/java/com/chronote/chronote/controller/TodoController.java

package com.chronote.chronote.controller;

import com.chronote.chronote.dto.TodoDto;
import com.chronote.chronote.entity.Todo;
import com.chronote.chronote.service.TodoService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    private Claims getClaims() {
        return (Claims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // GET /api/todos?date=2025-01-01
    @GetMapping
    public ResponseEntity<List<Todo>> getTodos(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(todoService.getTodos(getClaims(), date));
    }

    // POST /api/todos
    @PostMapping
    public ResponseEntity<Todo> addTodo(@RequestBody @Valid TodoDto dto) {
        return ResponseEntity.status(201).body(todoService.addTodo(getClaims(), dto));
    }

    // PATCH /api/todos/{id}/start
    @PatchMapping("/{id}/start")
    public ResponseEntity<?> startTodo(@PathVariable Long id) {
        todoService.startTodo(getClaims(), id);
        return ResponseEntity.ok(Map.of("message", "시작 시간 기록 완료"));
    }

    // PATCH /api/todos/{id}/complete
    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> completeTodo(@PathVariable Long id,
                                          @RequestBody Map<String, Integer> body) {
        int duration = body.getOrDefault("duration", 0);
        todoService.completeTodo(getClaims(), id, duration);
        return ResponseEntity.ok(Map.of("message", "완료 처리 완료"));
    }

    // DELETE /api/todos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(getClaims(), id);
        return ResponseEntity.ok(Map.of("message", "삭제 완료"));
    }
}