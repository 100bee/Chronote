// 📁 src/main/java/com/chronote/chronote/repository/UserRepository.java

package com.chronote.chronote.repository;

import com.chronote.chronote.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
}