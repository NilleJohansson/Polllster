package com.example.pollsterapi.repository;

import com.example.pollsterapi.models.documents.Draft;
import com.example.pollsterapi.payload.request.CreateDraftRequest;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface DraftRepository extends MongoRepository<Draft, String> {
    List<Draft> findAllByUserID(String userID);

//    List<Draft> findAllByUserIDOrderByCreateTimeDesc(String userID);

}
