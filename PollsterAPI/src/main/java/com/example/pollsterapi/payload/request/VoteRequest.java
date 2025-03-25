package com.example.pollsterapi.payload.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class VoteRequest {
    String pollID;
    String voteOptionID;
    String participantName;
    Boolean isOther;
    String otherOption;
}
