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
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "pollreplies")
public class PollReply implements Serializable {
    @Id
    private String id;
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId pollID;
    @DBRef
    private User user;
    private String comment;
    private Instant createTime;
}
