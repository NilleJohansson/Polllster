package com.example.pollsterapi.controllers;

import com.example.pollsterapi.payload.response.UserProfileResponse;
import com.example.pollsterapi.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173/", maxAge = 3600)
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        UserProfileResponse userProfileResponse = userService.getUserProfile();
        return ResponseEntity.ok(userProfileResponse);
    }
}
