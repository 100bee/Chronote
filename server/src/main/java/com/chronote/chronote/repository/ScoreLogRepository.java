package com.chronote.chronote.repository;

import com.chronote.chronote.entity.ScoreLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ScoreLogRepository extends JpaRepository<ScoreLog, Long> {

    List<ScoreLog> findTop20ByUserIdOrderByCreatedAtDesc(Long userId);

    @Query(value = """
        SELECT DATE(created_at) as date, SUM(score_change) as daily_score
        FROM score_log
        WHERE user_id = :userId
        AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at)
        ORDER BY date ASC
        """, nativeQuery = true)
    List<Object[]> findDailyScoreByUserId(@Param("userId") Long userId);
}