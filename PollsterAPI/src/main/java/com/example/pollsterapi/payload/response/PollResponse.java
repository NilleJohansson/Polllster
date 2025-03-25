package com.example.pollsterapi.payload.response;

import com.example.pollsterapi.models.documents.Poll;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PollResponse extends Poll implements Serializable {
    private Boolean userVoted;
}
