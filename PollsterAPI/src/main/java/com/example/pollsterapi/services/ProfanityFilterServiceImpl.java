package com.example.pollsterapi.services;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Set;

@Service
public class ProfanityFilterServiceImpl implements ProfanityFilterService {

    private Set<String> offensiveWords;

    @PostConstruct
    @Override
    public void loadOffensiveWords() {
        offensiveWords = new HashSet<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                getClass().getResourceAsStream("/profanities.txt"), StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                offensiveWords.add(line.trim().toLowerCase());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to load offensive words.", e);
        }
    }

    @Override
    public boolean containsProfanity(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        String[] words = text.toLowerCase().split("\\W+");
        for (String word : words) {
            if (offensiveWords.contains(word)) {
                return true;
            }
        }
        return false;
    }
}
