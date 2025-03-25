package com.example.pollsterapi.repository;

import com.example.pollsterapi.models.documents.PollComment;
import com.example.pollsterapi.models.documents.PollVote;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.List;
import java.util.Optional;

public interface PollVoteRepository extends MongoRepository<PollVote, String> {
    List<PollVote> findByPollIDAndUserID(ObjectId pollID, ObjectId userID);
}
