package com.example.pollsterapi.repository;

import com.example.pollsterapi.models.documents.Poll;
import com.example.pollsterapi.models.documents.PollComment;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.Update;

import java.util.List;
import java.util.Optional;

public interface PollCommentRepository extends MongoRepository<PollComment, String> {
    @Query("{'_id' : ?0}")
    @Update("{'$set': {'comment': ?1}}")
    void updateComment(String commentID, String comment);

    @Query(value = "{'pollID': ?0}", fields = "{'user.password': 0}")
    List<PollComment> findByPollID(ObjectId pollID);
}
