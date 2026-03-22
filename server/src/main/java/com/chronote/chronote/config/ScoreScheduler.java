// 📁 src/main/java/com/chronote/chronote/config/ScoreScheduler.java

package com.chronote.chronote.config;

import com.chronote.chronote.entity.User;
import com.chronote.chronote.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScoreScheduler {

    private final UserRepository userRepository;

    // 매일 새벽 3시 - 7일 미접속 유저 감점
    @Scheduled(cron = "0 0 3 * * *")
    public void penaltyForInactivity() {
        log.info("[SCHEDULER] 7일 미접속 유저 감점 실행");

        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);

        List<User> inactiveUsers = userRepository.findAll().stream()
                .filter(u -> u.getLastLoginAt() == null ||
                        u.getLastLoginAt().isBefore(sevenDaysAgo))
                .toList();

        for (User user : inactiveUsers) {
            user.deductScore(10);
            userRepository.save(user);
            log.info("[SCHEDULER] 감점 처리: {} (-10점)", user.getUserId());
        }

        log.info("[SCHEDULER] 감점 완료 - 총 {}명", inactiveUsers.size());
    }

    // 매년 1월 1일 새벽 3시 - 전체 점수 초기화
    @Scheduled(cron = "0 0 3 1 1 *")
    public void resetAllScores() {
        log.info("[SCHEDULER] 연초 점수 초기화 실행");

        List<User> allUsers = userRepository.findAll();

        for (User user : allUsers) {
            user.resetScore();
            userRepository.save(user);
        }

        log.info("[SCHEDULER] 초기화 완료 - 총 {}명", allUsers.size());
    }
}