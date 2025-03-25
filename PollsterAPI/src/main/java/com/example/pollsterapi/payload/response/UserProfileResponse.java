package com.example.pollsterapi.payload.response;

import com.example.pollsterapi.models.documents.Draft;
import com.example.pollsterapi.models.documents.Poll;

import java.util.List;

public class UserProfileResponse {
    public List<Draft> drafts;
    public List<Poll> polls;

    public UserProfileResponse() {}

    public UserProfileResponse(List<Draft> drafts, List<Poll> polls) {
        this.drafts = drafts;
        this.polls = polls;
    }

    public List<Draft> getDrafts() {
        return drafts;
    }

    public void setDrafts(List<Draft> drafts) {
        this.drafts = drafts;
    }

    public List<Poll> getPolls() {
        return polls;
    }

    public void setPolls(List<Poll> polls) {
        this.polls = polls;
    }
}
