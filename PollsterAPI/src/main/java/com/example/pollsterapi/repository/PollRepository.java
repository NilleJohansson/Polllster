package com.example.pollsterapi.repository;

import com.example.pollsterapi.models.documents.Draft;
import com.example.pollsterapi.models.documents.Poll;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PollRepository extends MongoRepository<Poll, String> {
    List<Poll> findAllByUserID(String userID);

    List<Poll> findAllByUserIDOrderByCreateTimeDesc(String userID);

    @Aggregation(pipeline = {
            "{ $match: { '_id': ?0 } }",
            "{ $lookup: { from: 'pollcomments', localField: '_id', foreignField: 'pollID', as: 'comments' } }",
    })
    Optional<Poll> findPollWithComments(String pollID);
}