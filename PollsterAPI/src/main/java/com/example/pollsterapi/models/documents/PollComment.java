package com.example.pollsterapi.models.documents;

import com.example.pollsterapi.models.PollOption;
import com.example.pollsterapi.models.Settings;
import com.example.pollsterapi.payload.request.CreatePollRequest;
import com.example.pollsterapi.serializers.ObjectIdSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.extern.jackson.Jacksonized;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "pollcomments")
public class PollComment implements Serializable {
    @Id
    private String id;
    @JsonSerialize(using = ObjectIdSerializer.class)
    private ObjectId pollID;
    @DBRef
    private User user;
    private String comment;
    private Instant createTime;
    @DBRef
    private List<PollReply> replies = new ArrayList<>();
}
