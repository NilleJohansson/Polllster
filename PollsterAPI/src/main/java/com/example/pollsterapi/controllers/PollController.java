package com.example.pollsterapi.controllers;

import com.example.pollsterapi.models.documents.Draft;
import com.example.pollsterapi.models.documents.Poll;
import com.example.pollsterapi.models.documents.PollComment;
import com.example.pollsterapi.models.documents.PollReply;
import com.example.pollsterapi.payload.request.*;
import com.example.pollsterapi.payload.response.MessageResponse;
import com.example.pollsterapi.payload.response.PollResponse;
import com.example.pollsterapi.services.PollService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.mongodb.core.ChangeStreamOptions;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyEmitter;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;

import java.io.IOException;
import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@CrossOrigin(origins = "http://localhost:5173/", maxAge = 3600)
@RestController
@RequestMapping("/api/poll")
public class PollController {

    @Autowired
    PollService pollService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/createdraft")
    public ResponseEntity<?> createDraft(@Valid @RequestBody CreateDraftRequest createDraftRequest) {
        pollService.saveDraft(createDraftRequest);
        return ResponseEntity.ok(new MessageResponse("Draft added"));
    }

    @GetMapping("/getdrafts")
    public ResponseEntity<?> getDraft() {
        List<Draft> drafts = pollService.getDrafts();
        return ResponseEntity.ok(drafts);
    }

    @DeleteMapping("/deletedraft/{draftID}")
    public ResponseEntity<?> deleteDraft(@PathVariable String draftID) {
        pollService.deleteDraft(draftID);
        return ResponseEntity.ok(new MessageResponse("Draft deleted"));
    }

    @PostMapping(value = "/createpoll", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> createPoll(@RequestPart("data") String data,
                                        @RequestPart(value = "image", required = false) MultipartFile image) {
        CreatePollRequest createPollRequest = null;
        try {
            createPollRequest = objectMapper.readValue(data, CreatePollRequest.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.badRequest().body("Invalid json");
        }

        pollService.savePoll(createPollRequest, image);
        return ResponseEntity.ok(new MessageResponse("Poll added"));
    }

    @GetMapping("/{pollID}")
    public ResponseEntity<PollResponse> getPoll(@PathVariable String pollID) {
        PollResponse poll = pollService.getPoll(pollID);
        return ResponseEntity.ok(poll);
    }

    @PostMapping("/vote")
    public ResponseEntity<?> vote(@Valid @RequestBody List<VoteRequest> voteRequestList) {
        pollService.vote(voteRequestList);
        return ResponseEntity.ok(new MessageResponse("Vote added"));
    }

    @GetMapping(value = "/getPollVotes/{pollID}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    @ResponseBody
    public SseEmitter getPollVotes(@PathVariable String pollID) throws InterruptedException {
        System.out.println("In here");
//        SseEmitter emitter = new SseEmitter();
//        ExecutorService sseMvcExecutor = Executors.newSingleThreadExecutor();
//        sseMvcExecutor.execute(() -> {
//            try {
//                for (int i = 0; true; i++) {
//                    SseEmitter.SseEventBuilder event = SseEmitter.event()
//                            .data("SSE MVC - " + LocalTime.now().toString())
//                            .id(String.valueOf(i))
//                            .name("sse event - mvc");
//                    emitter.send(event);
//                    Thread.sleep(5000);
//                }
//            } catch (Exception ex) {
//                emitter.completeWithError(ex);
//            }
//        });
        return pollService.getPollVotes(pollID);
    }

    @GetMapping("/sse")
    public ResponseBodyEmitter handleSSE() {
//        SseEmitter emitter = new SseEmitter();
//        new Thread(() -> {
//            for (int i = 0; i < 10; i++) {
//                try {
//                //    emitter.send(SseEmitter.event().name("message").data("This is event " + i));
//                    Thread.sleep(1000);
//                } catch (InterruptedException e) {
//                    emitter.completeWithError(e);
//                    return;
//                }
//            }
//            emitter.complete();
//        }).start();
//        return emitter;
        SseEmitter emitter = new SseEmitter();
        ExecutorService sseMvcExecutor = Executors.newSingleThreadExecutor();
        sseMvcExecutor.execute(() -> {
            try {
                for (int i = 0; true; i++) {
                    SseEmitter.SseEventBuilder event = SseEmitter.event()
                            .data("SSE MVC - " + LocalTime.now().toString())
                            .id(String.valueOf(i))
                            .name("sse event - mvc");
                    emitter.send(event);
                    Thread.sleep(5000);
                }
            } catch (Exception ex) {
                emitter.completeWithError(ex);
            }
        });
        return emitter;
    }

    @PostMapping("/addcomment")
    public ResponseEntity<?> addComment(@Valid @RequestBody AddCommentRequest addCommentRequest) {
        PollComment savedComment = pollService.addComment(addCommentRequest);
        return ResponseEntity.ok(savedComment);
    }

    @PutMapping("/updatecomment")
    public ResponseEntity<?> updateComment(@Valid @RequestBody UpdateCommentRequest updateCommentRequest) {
        pollService.updateComment(updateCommentRequest);
        return ResponseEntity.ok(new MessageResponse("Comment updated"));
    }

    @DeleteMapping("/deletecomment/{commentID}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentID) {
        pollService.deleteComment(commentID);
        return ResponseEntity.ok(new MessageResponse("Comment deleted"));
    }

    @PostMapping("/addreply")
    public ResponseEntity<?> addReply(@Valid @RequestBody AddReplyRequest addReplyRequest) {
        PollReply savedReply = pollService.addReply(addReplyRequest);
        return ResponseEntity.ok(savedReply);
    }

    @PutMapping("/updatereply")
    public ResponseEntity<?> updateReply(@Valid @RequestBody UpdateReplyRequest updateReplyRequest) {
        pollService.updateReply(updateReplyRequest);
        return ResponseEntity.ok(new MessageResponse("Reply updated"));
    }

    @DeleteMapping("/deletereply/{commentID}/{replyID}")
    public ResponseEntity<?> deleteReply(@PathVariable String commentID, @PathVariable String replyID) {
        pollService.deleteReply(commentID, replyID);
        return ResponseEntity.ok(new MessageResponse("Reply deleted"));
    }
}
