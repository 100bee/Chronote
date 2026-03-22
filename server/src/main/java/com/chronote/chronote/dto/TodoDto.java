// 📁 src/main/java/com/chronote/chronote/dto/TodoDto.java

package com.chronote.chronote.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import java.time.LocalDate;

@Getter
public class TodoDto {

    @NotBlank
    private String content;

    @NotNull
    private LocalDate date;
}