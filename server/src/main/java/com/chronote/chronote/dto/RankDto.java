// 📁 src/main/java/com/chronote/chronote/dto/RankDto.java

package com.chronote.chronote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RankDto {
    private String userId;
    private String nickname;
    private int score;
    private String tier;
}