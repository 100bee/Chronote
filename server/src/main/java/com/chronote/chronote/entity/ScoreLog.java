package com.chronote.chronote.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "score_log")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScoreLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private int scoreChange;

    private String reason;

    @CreationTimestamp
    private LocalDateTime createdAt;
}