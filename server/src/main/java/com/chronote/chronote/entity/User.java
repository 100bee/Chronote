// 📁 src/main/java/com/chronote/chronote/entity/User.java

package com.chronote.chronote.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_info")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true, nullable = false)
    private String userId;

    @Column(nullable = false)
    private String password;

    private String nickname;

    @Column(columnDefinition = "INT DEFAULT 0")
    private int score;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT '브론즈'")
    private String tier;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public void updateScore(int score) {
        this.score = score;
    }

    public void updateTier(String tier) {
        this.tier = tier;
    }
}