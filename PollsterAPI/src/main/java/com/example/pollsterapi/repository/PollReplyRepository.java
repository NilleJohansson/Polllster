package com.example.pollsterapi.repository;

import com.example.pollsterapi.models.documents.PollComment;
import com.example.pollsterapi.models.documents.PollReply;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

public interface PollReplyRepository extends MongoRepository<PollReply, String> {}
