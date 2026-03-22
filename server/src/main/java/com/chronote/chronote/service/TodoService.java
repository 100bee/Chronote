// 📁 src/main/java/com/chronote/chronote/service/TodoService.java

package com.chronote.chronote.service;

import com.chronote.chronote.dto.TodoDto;
import com.chronote.chronote.entity.Todo;
import com.chronote.chronote.repository.TodoRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;

    private Long getUserId(Claims claims) {
        return ((Number) claims.get("id")).longValue();
    }

    public List<Todo> getTodos(Claims claims, LocalDate date) {
        Long userId = getUserId(claims);
        if (date != null) {
            return todoRepository.findByUserIdAndDueDate(userId, date);
        }
        return todoRepository.findByUserId(userId);
    }

    public Todo addTodo(Claims claims, TodoDto dto) {
        Long userId = getUserId(claims);
        Todo todo = Todo.builder()
                .userId(userId)
                .content(dto.getContent())
                .dueDate(dto.getDate())
                .isCompleted(0)
                .isStarted(0)
                .duration(0)
                .build();
        return todoRepository.save(todo);
    }

    public void startTodo(Claims claims, Long todoId) {
        Long userId = getUserId(claims);
        Todo todo = todoRepository.findById(todoId)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("할 일을 찾을 수 없습니다."));
        todo.start();
        todoRepository.save(todo);
    }

    public void completeTodo(Claims claims, Long todoId, int duration) {
        Long userId = getUserId(claims);
        Todo todo = todoRepository.findById(todoId)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("할 일을 찾을 수 없습니다."));
        todo.complete(duration);
        todoRepository.save(todo);
    }

    public void deleteTodo(Claims claims, Long todoId) {
        Long userId = getUserId(claims);
        Todo todo = todoRepository.findById(todoId)
                .filter(t -> t.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("할 일을 찾을 수 없습니다."));
        todoRepository.delete(todo);
    }
}