// 📁 src/main/java/com/chronote/chronote/repository/TodoRepository.java

package com.chronote.chronote.repository;

import com.chronote.chronote.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserId(Long userId);
    List<Todo> findByUserIdAndDueDate(Long userId, LocalDate dueDate);
}