package com.example.pollsterapi.payload.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class UpdateReplyRequest {
    private String replyID;
    private String reply;
}
