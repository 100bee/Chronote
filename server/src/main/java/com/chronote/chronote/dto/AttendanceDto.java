// 📁 src/main/java/com/chronote/chronote/dto/AttendanceDto.java

package com.chronote.chronote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
public class AttendanceDto {
    private boolean alreadyChecked;
    private LocalDate today;
    private int totalCount;
    private List<LocalDate> history;
}