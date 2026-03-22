// 📁 src/main/java/com/chronote/chronote/entity/Todo.java

package com.chronote.chronote.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "todo")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String content;

    private LocalDate dueDate;

    @Column(columnDefinition = "TINYINT(1) DEFAULT 0")
    private int isCompleted;

    @Column(columnDefinition = "TINYINT(1) DEFAULT 0")
    private int isStarted;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    @Column(columnDefinition = "INT DEFAULT 0")
    private int duration;

    public void start() {
        this.isStarted = 1;
        this.startTime = LocalDateTime.now();
    }

    public void complete(int duration) {
        this.isCompleted = 1;
        this.endTime = LocalDateTime.now();
        this.duration = duration;
    }
}