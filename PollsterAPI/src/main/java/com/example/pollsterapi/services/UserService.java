package com.example.pollsterapi.services;

import com.example.pollsterapi.models.documents.User;
import com.example.pollsterapi.payload.response.UserProfileResponse;

public interface UserService {
    UserProfileResponse getUserProfile();

    User getUser();
}
