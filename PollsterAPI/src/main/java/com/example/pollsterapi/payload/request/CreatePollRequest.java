package com.example.pollsterapi.payload.request;

import com.example.pollsterapi.models.PollOption;
import com.example.pollsterapi.models.Settings;
import com.example.pollsterapi.models.documents.Poll;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.*;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@SuperBuilder
//@JsonTypeInfo(
//        use = JsonTypeInfo.Id.NAME,
//        include = JsonTypeInfo.As.PROPERTY,
//        property = "type"
//)
//@JsonSubTypes({
//        @JsonSubTypes.Type(value = Poll.class, name = "poll")
//})
public class CreatePollRequest implements Serializable {
    private String title;
    private String description;
    private String imageLink;
    private String votingType;
    private ArrayList<PollOption> votingOptions;
    private Settings settings;
    private Instant createTime;
    private boolean hasOtherOption;
}
