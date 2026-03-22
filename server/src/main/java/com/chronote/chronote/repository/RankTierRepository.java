// 📁 src/main/java/com/chronote/chronote/repository/RankTierRepository.java

package com.chronote.chronote.repository;

import com.chronote.chronote.entity.RankTier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RankTierRepository extends JpaRepository<RankTier, Long> {

    // 현재 점수보다 높은 티어 중 가장 낮은 것 (다음 티어)
    Optional<RankTier> findFirstByMinScoreGreaterThanOrderByMinScoreAsc(int score);
}