package com.example.pollsterapi.services;

import com.example.pollsterapi.models.documents.Draft;
import com.example.pollsterapi.models.documents.Poll;
import com.example.pollsterapi.models.documents.PollComment;
import com.example.pollsterapi.models.documents.PollReply;
import com.example.pollsterapi.payload.request.*;
import com.example.pollsterapi.payload.response.PollResponse;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface PollService {
    void saveDraft(CreateDraftRequest createDraftRequest);

    List<Draft> getDrafts();

    void deleteDraft(String draftID);

    void savePoll(CreatePollRequest createPollRequest, MultipartFile image);

    void deletePoll(String pollID);

    PollResponse getPoll(String pollID);

    void vote(List<VoteRequest> voteRequest);

    SseEmitter getPollVotes(String pollID) throws InterruptedException;

    void emitVote(Poll poll);

    PollComment addComment(AddCommentRequest addCommentRequest);

    void updateComment(UpdateCommentRequest updateCommentRequest);

    void deleteComment(String commentID);

    PollReply addReply(AddReplyRequest addReplyRequest);

    void updateReply(UpdateReplyRequest updateReplyRequest);

    void deleteReply(String commentID, String replyID);
}
