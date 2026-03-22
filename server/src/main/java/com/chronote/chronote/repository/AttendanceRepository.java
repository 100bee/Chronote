// 📁 src/main/java/com/chronote/chronote/repository/AttendanceRepository.java

package com.chronote.chronote.repository;

import com.chronote.chronote.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    boolean existsByUserIdAndAttendDate(Long userId, LocalDate date);
    List<Attendance> findByUserId(Long userId);
    List<Attendance> findByUserIdAndAttendDateBetween(Long userId, LocalDate start, LocalDate end);
}