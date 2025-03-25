package com.example.pollsterapi.payload.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class AddReplyRequest {
    private String email;
    private String pollID;
    private String commentID;
    private String comment;
}
