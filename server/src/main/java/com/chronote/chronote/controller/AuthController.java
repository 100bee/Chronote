// 📁 src/main/java/com/chronote/chronote/controller/AuthController.java

package com.chronote.chronote.controller;

import com.chronote.chronote.dto.LoginRequest;
import com.chronote.chronote.dto.SignupRequest;
import com.chronote.chronote.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody @Valid SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok(Map.of("message", "회원가입 성공"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid LoginRequest request) {
        Map<String, Object> result = authService.login(request);
        return ResponseEntity.ok(result);
    }
}