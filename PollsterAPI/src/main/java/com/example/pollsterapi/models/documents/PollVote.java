package com.example.pollsterapi.models.documents;

import com.example.pollsterapi.serializers.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.*;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "pollvote")
public class PollVote {
    @Id
    private String id;
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId pollID;
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId userID;
    private String vote;
}
