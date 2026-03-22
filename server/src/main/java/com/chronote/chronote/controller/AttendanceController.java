// 📁 src/main/java/com/chronote/chronote/controller/AttendanceController.java

package com.chronote.chronote.controller;

import com.chronote.chronote.dto.AttendanceDto;
import com.chronote.chronote.service.AttendanceService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    private Claims getClaims() {
        return (Claims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // POST /api/attendance - 출석 체크
    @PostMapping
    public ResponseEntity<Map<String, Object>> checkAttendance() {
        return ResponseEntity.ok(attendanceService.checkAttendance(getClaims()));
    }

    // GET /api/attendance - 출석 현황
    @GetMapping
    public ResponseEntity<AttendanceDto> getAttendance() {
        return ResponseEntity.ok(attendanceService.getAttendance(getClaims()));
    }

    // GET /api/attendance/monthly - 이번 달 출석
    @GetMapping("/monthly")
    public ResponseEntity<List<LocalDate>> getMonthlyAttendance() {
        return ResponseEntity.ok(attendanceService.getMonthlyAttendance(getClaims()));
    }
}