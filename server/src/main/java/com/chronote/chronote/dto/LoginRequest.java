// 📁 src/main/java/com/chronote/chronote/dto/LoginRequest.java

package com.chronote.chronote.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class LoginRequest {

    @NotBlank
    private String email;

    @NotBlank
    private String password;
}