// 📁 src/main/java/com/chronote/chronote/service/AttendanceService.java

package com.chronote.chronote.service;

import com.chronote.chronote.dto.AttendanceDto;
import com.chronote.chronote.entity.Attendance;
import com.chronote.chronote.repository.AttendanceRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    private Long getUserId(Claims claims) {
        return ((Number) claims.get("id")).longValue();
    }

    // 출석 체크
    public Map<String, Object> checkAttendance(Claims claims) {
        Long userId = getUserId(claims);
        LocalDate today = LocalDate.now();

        if (attendanceRepository.existsByUserIdAndAttendDate(userId, today)) {
            return Map.of(
                    "message", "이미 출석했습니다.",
                    "alreadyChecked", true
            );
        }

        Attendance attendance = Attendance.builder()
                .userId(userId)
                .attendDate(today)
                .build();

        attendanceRepository.save(attendance);

        return Map.of(
                "message", "출석 완료!",
                "alreadyChecked", false,
                "date", today
        );
    }

    // 출석 현황 조회
    public AttendanceDto getAttendance(Claims claims) {
        Long userId = getUserId(claims);
        LocalDate today = LocalDate.now();

        boolean alreadyChecked = attendanceRepository
                .existsByUserIdAndAttendDate(userId, today);

        List<Attendance> history = attendanceRepository.findByUserId(userId);

        List<LocalDate> dates = history.stream()
                .map(Attendance::getAttendDate)
                .sorted()
                .collect(Collectors.toList());

        return new AttendanceDto(alreadyChecked, today, dates.size(), dates);
    }

    // 이번 달 출석 조회
    public List<LocalDate> getMonthlyAttendance(Claims claims) {
        Long userId = getUserId(claims);
        LocalDate start = LocalDate.now().withDayOfMonth(1);
        LocalDate end = LocalDate.now();

        return attendanceRepository
                .findByUserIdAndAttendDateBetween(userId, start, end)
                .stream()
                .map(Attendance::getAttendDate)
                .sorted()
                .collect(Collectors.toList());
    }
}