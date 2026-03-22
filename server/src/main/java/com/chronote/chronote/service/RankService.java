// 📁 src/main/java/com/chronote/chronote/service/RankService.java

package com.chronote.chronote.service;

import com.chronote.chronote.dto.RankDto;
import com.chronote.chronote.dto.UserInfoDto;
import com.chronote.chronote.entity.RankTier;
import com.chronote.chronote.entity.User;
import com.chronote.chronote.repository.RankTierRepository;
import com.chronote.chronote.repository.UserRepository;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankService {

    private final UserRepository userRepository;
    private final RankTierRepository rankTierRepository;

    // 전체 랭킹 상위 20명
    public List<RankDto> getRanking() {
        return userRepository.findAll(
                        PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "score"))
                ).stream()
                .map(u -> new RankDto(u.getUserId(), u.getNickname(), u.getScore(), u.getTier()))
                .collect(Collectors.toList());
    }

    // 내 정보 + 다음 티어
    public UserInfoDto getUserInfo(Claims claims) {
        Long id = ((Number) claims.get("id")).longValue();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("유저 정보 없음"));

        Optional<RankTier> nextTierOpt = rankTierRepository
                .findFirstByMinScoreGreaterThanOrderByMinScoreAsc(user.getScore());

        UserInfoDto.NextTierDto nextTierDto = nextTierOpt.map(t ->
                new UserInfoDto.NextTierDto(t.getName(), t.getMinScore() - user.getScore())
        ).orElse(null);

        return new UserInfoDto(
                user.getUserId(),
                user.getNickname(),
                user.getScore(),
                user.getTier(),
                nextTierDto
        );
    }
}