// 📁 src/main/java/com/chronote/chronote/service/AuthService.java

package com.chronote.chronote.service;

import com.chronote.chronote.dto.LoginRequest;
import com.chronote.chronote.dto.SignupRequest;
import com.chronote.chronote.entity.User;
import com.chronote.chronote.repository.UserRepository;
import com.chronote.chronote.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public void signup(SignupRequest request) {
        if (userRepository.existsByUserId(request.getEmail())) {
            throw new RuntimeException("이미 존재하는 이메일입니다.");
        }

        User user = User.builder()
                .userId(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname() != null ? request.getNickname() : "익명")
                .score(0)
                .tier("브론즈")
                .build();

        userRepository.save(user);
    }

    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByUserId(request.getEmail())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        user.updateLastLogin();
        userRepository.save(user);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getUserId(), user.getNickname());

        return Map.of(
                "token", token,
                "nickname", user.getNickname(),
                "userId", user.getUserId()
        );
    }
}