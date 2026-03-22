// 📁 src/main/java/com/chronote/chronote/dto/UserInfoDto.java

package com.chronote.chronote.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserInfoDto {
    private String userId;
    private String nickname;
    private int score;
    private String tier;
    private NextTierDto nextTier;

    @Getter
    @AllArgsConstructor
    public static class NextTierDto {
        private String name;
        private int requiredScore;
    }
}