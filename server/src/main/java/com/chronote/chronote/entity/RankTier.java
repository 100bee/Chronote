// 📁 src/main/java/com/chronote/chronote/entity/RankTier.java

package com.chronote.chronote.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rank_tiers")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RankTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int minScore;
}