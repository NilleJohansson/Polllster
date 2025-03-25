package com.example.pollsterapi.security.services;

import com.example.pollsterapi.exceptions.TokenRefreshException;
import com.example.pollsterapi.models.documents.User;
import com.example.pollsterapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Value("${pollster.app.jwtExpirationMs}")
    private Long refreshTokenDurationMs;


    @Autowired
    private UserRepository userRepository;

    public Optional<User> findByToken(String token) {
        return userRepository.findByToken(token);
    }

    public String createRefreshToken() {
        return UUID.randomUUID().toString();
    }

    public User verifyExpiration(User user) {
        if (user.getTokenExpiryDate().compareTo(Instant.now()) < 0) {
            String token = user.getToken();
            user.setToken("");
            userRepository.save(user);
            throw new TokenRefreshException(token, "Refresh token was expired. Please make a new signin request");
        }

        return user;
    }

    @Transactional
    public int deleteByUserId(Long userId) {
      //  return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
        return 0;
    }
}
