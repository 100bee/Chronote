// 📁 src/main/java/com/chronote/chronote/controller/RankController.java

package com.chronote.chronote.controller;

import com.chronote.chronote.dto.RankDto;
import com.chronote.chronote.dto.UserInfoDto;
import com.chronote.chronote.service.RankService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rank")
@RequiredArgsConstructor
public class RankController {

    private final RankService rankService;

    private Claims getClaims() {
        return (Claims) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // GET /api/rank - 전체 랭킹
    @GetMapping
    public ResponseEntity<List<RankDto>> getRanking() {
        return ResponseEntity.ok(rankService.getRanking());
    }

    // GET /api/rank/userinfo - 내 정보
    @GetMapping("/userinfo")
    public ResponseEntity<UserInfoDto> getUserInfo() {
        return ResponseEntity.ok(rankService.getUserInfo(getClaims()));
    }
}