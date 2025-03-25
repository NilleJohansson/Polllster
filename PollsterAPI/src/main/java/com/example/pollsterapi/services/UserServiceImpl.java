package com.example.pollsterapi.services;

import com.example.pollsterapi.exceptions.EntityNotFoundException;
import com.example.pollsterapi.models.documents.User;
import com.example.pollsterapi.payload.response.UserProfileResponse;
import com.example.pollsterapi.repository.DraftRepository;
import com.example.pollsterapi.repository.PollRepository;
import com.example.pollsterapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    DraftRepository draftRepository;

    @Autowired
    PollRepository pollRepository;

    @Override
    public UserProfileResponse getUserProfile() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> user = userRepository.findByUsername(userDetails.getUsername());
        UserProfileResponse userProfileResponse = new UserProfileResponse();

        if (user.isPresent()) {
            System.out.println(user.get().getId());
            userProfileResponse.setDrafts(draftRepository.findAllByUserID(user.get().getId()));
            userProfileResponse.setPolls(pollRepository.findAllByUserIDOrderByCreateTimeDesc(user.get().getId()));
        } else {
            throw new EntityNotFoundException("User not found");
        }

        return userProfileResponse;
    }

    @Override
    public User getUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> user = userRepository.findByUsername(userDetails.getUsername());

        if (user.isEmpty()) {
            throw new UsernameNotFoundException("User not found: " + userDetails.getUsername());
        }

        return user.get();
    }
}

//6783ca09fe61386b6ae4143a
