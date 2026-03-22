// 📁 src/main/java/com/chronote/chronote/dto/SignupRequest.java

package com.chronote.chronote.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class SignupRequest {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String nickname;
}