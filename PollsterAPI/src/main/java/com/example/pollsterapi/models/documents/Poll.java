package com.example.pollsterapi.models.documents;

import com.example.pollsterapi.models.PollOption;
import com.example.pollsterapi.models.Settings;
import com.example.pollsterapi.payload.request.CreatePollRequest;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Document(collection = "polls")
public class Poll extends CreatePollRequest implements Serializable {
    @Id
    private String id;

    private String userID;
    private String createdBy;

    @DBRef
    private List<PollComment> comments = new ArrayList<>();
}
