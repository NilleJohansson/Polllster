package com.example.pollsterapi.services;

import java.util.Set;

public interface ProfanityFilterService {

    void loadOffensiveWords();

    boolean containsProfanity(String text);
}
