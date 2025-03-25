package com.example.pollsterapi.services;

import com.example.pollsterapi.exceptions.BadRequestException;
import com.example.pollsterapi.exceptions.EntityNotFoundException;
import com.example.pollsterapi.models.PollOption;
import com.example.pollsterapi.models.documents.*;
import com.example.pollsterapi.payload.request.*;
import com.example.pollsterapi.payload.response.PollResponse;
import com.example.pollsterapi.repository.*;
import com.mongodb.MongoException;
import jakarta.validation.Valid;
import org.bson.types.ObjectId;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PollServiceImpl implements PollService {
    private final Map<String, List<SseEmitter>> polls = new ConcurrentHashMap<>();

    @Autowired
    UserRepository userRepository;

    @Autowired
    DraftRepository draftRepository;

    @Autowired
    PollCommentRepository pollCommentRepository;

    @Autowired
    PollReplyRepository pollReplyRepository;

    @Autowired
    PollVoteRepository pollVoteRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private ReactiveMongoTemplate reactiveMongoTemplate;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private ProfanityFilterService profanityFilterService;

    @Autowired
    private UserService userService;

    @Override
    public void saveDraft(CreateDraftRequest createDraftRequest) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> user = userRepository.findByUsername(userDetails.getUsername());

        if (user.isPresent()) {
            Draft draft = modelMapper.map(createDraftRequest, Draft.class);
            draft.setUserID(user.get().getId());
            draftRepository.save(draft);
        } else {
            throw new EntityNotFoundException("User not found");
        }
    }

    @Override
    public List<Draft> getDrafts() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> user = userRepository.findByUsername(userDetails.getUsername());

        // TODO: Handle case when user is not present

        if (user.isPresent()) {
            return draftRepository.findAllByUserID(user.get().getId());
        } else {
            throw new EntityNotFoundException("User not found");
        }
    }

    @Override
    public void deleteDraft(String draftID) {
        Optional<Draft> draftToDelete = draftRepository.findById(draftID);

        if (!draftToDelete.isPresent()) {
            throw new EntityNotFoundException("Draft not found");
        }

        try {
            draftRepository.deleteById(draftID);
        } catch (Exception e) {
            throw new MongoException("Unable to delete draft from MongoDB");
        }
    }

    @Override
    public void savePoll(CreatePollRequest createPollRequest, MultipartFile image) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Optional<User> user = userRepository.findByUsername(userDetails.getUsername());

        String imageURL = "";

        if (image != null && !image.isEmpty()) {
            String key = "poll-images/" + image.getOriginalFilename();
            try {
                imageURL = s3Service.uploadFile(key, image.getBytes(), image.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image to S3", e);
            }

            System.out.println("ImageURL " + imageURL);
        }

        if (user.isPresent()) {
            Poll poll = modelMapper.map(createPollRequest, Poll.class);
            poll.setUserID(user.get().getId());
            poll.setCreatedBy(user.get().getUsername());
            poll.setImageLink(imageURL);
            poll.setCreateTime(createPollRequest.getCreateTime());
            pollRepository.save(poll);
        } else {
            throw new EntityNotFoundException("User not found");
        }
    }

    @Override
    public void deletePoll(String pollID) {

    }

    private PollResponse createPollResponse(Poll poll, boolean hasVoted) {
        PollResponse pollResponse = PollResponse.builder()
                .id(poll.getId())
                .userID(poll.getUserID())
                .createdBy(poll.getCreatedBy())
                .comments(poll.getComments())
                .userVoted(hasVoted)
                .title(poll.getTitle())
                .description(poll.getDescription())
                .settings(poll.getSettings())
                .votingOptions(poll.getVotingOptions())
                .build();

        return pollResponse;
    }

    @Override
//    @Cacheable(value = "poll", key = "#pollID")
    public PollResponse getPoll(String pollID) {
        Optional<Poll> poll = pollRepository.findPollWithComments(pollID);

        if (poll.isPresent()) {

            User user = userService.getUser();

            List<PollVote> pollVotes = pollVoteRepository.findByPollIDAndUserID(new ObjectId(poll.get().getId()),
                    new ObjectId(user.getId()));

            boolean hasVoted = pollVotes != null && !pollVotes.isEmpty();

            poll.get().getComments().forEach(comment -> {
                if (comment.getUser() != null) {
                    comment.getUser().setPassword(null);
                    comment.getUser().setTokenExpiryDate(null);
                    comment.getUser().setToken(null);
                }
            });

            return createPollResponse(poll.get(), hasVoted);
        } else {
            throw new EntityNotFoundException("Poll not found");
        }
    }

    private PollOption createPollOtherOption(String otherOption) {
        PollOption pollOption = new PollOption();
        pollOption.setOtherOption(true);
        pollOption.setOption(otherOption);
        pollOption.setVoteAmount(0);

        return pollOption;
    }

    private PollVote createPollVote(String pollID, String userID, String vote) {
        PollVote pollVote = new PollVote();
        pollVote.setPollID(new ObjectId(pollID));
        pollVote.setUserID(new ObjectId(userID));
        pollVote.setVote(vote);

        return pollVote;
    }

    @Override
    public void vote(@Valid List<VoteRequest> voteRequestList) {
        if (voteRequestList == null || voteRequestList.isEmpty()) throw new BadRequestException("No valid votes added");

        List<PollVote> pollVotes = new ArrayList<>();
        Optional<Poll> poll = pollRepository.findById(voteRequestList.get(0).getPollID());

        if (poll.isPresent()) {

            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> user = userRepository.findByUsername(userDetails.getUsername());

            if (user.isEmpty()) {
                throw new UsernameNotFoundException("User not found: " + userDetails.getUsername());
            }

//            List<PollVote> previousVotes = pollVoteRepository.findByPollIDAndUserID(new ObjectId(poll.get().getId()),
//                    new ObjectId(user.get().getId()));

//            if (previousVotes != null && !previousVotes.isEmpty()) {
//                throw new BadRequestException("You have already voted on this poll.");
//            }

            List<PollOption> pollOptions = poll.get().getVotingOptions();
            for (VoteRequest voteRequest : voteRequestList) {

                if (voteRequest.getIsOther() && voteRequest.getOtherOption().isBlank()) {
                    throw new BadRequestException("The other voting option may not be empty");
                }

                Optional<PollOption> pollOption = Optional.empty();

                if (voteRequest.getIsOther()) {
                    pollOption = pollOptions.stream().filter(p -> p.getOption().equalsIgnoreCase(voteRequest.getOtherOption())).findFirst();
                    if (pollOption.isEmpty()) {
                        pollOption = Optional.of(createPollOtherOption(voteRequest.getOtherOption()));
                        poll.get().getVotingOptions().add(pollOption.get());
                    }
                } else {
                    pollOption = pollOptions.stream().filter(p -> p.getId().equalsIgnoreCase(voteRequest.getVoteOptionID())).findFirst();
                }

                if (pollOption.isPresent()) {
                    PollOption option = pollOption.get();
                    option.setVoteAmount(option.getVoteAmount() + 1);
                    pollOptions.stream().filter(p -> p.getId() == option.getId()).findAny().get().setOption(option.getOption());
                    pollVotes.add(createPollVote(poll.get().getId(), user.get().getId(), option.getOption()));
                } else {
                    throw new EntityNotFoundException("Poll option not found");
                }
            }

            poll.get().setVotingOptions((ArrayList<PollOption>) pollOptions);
            Poll savedPoll = pollRepository.save(poll.get());
            emitVote(savedPoll);
            pollVoteRepository.saveAll(pollVotes);
        } else {
            throw new EntityNotFoundException("Poll not found");
        }
    }

    @Override
    public SseEmitter getPollVotes(String pollID) {
        SseEmitter emitter = new SseEmitter(0l);
        List<SseEmitter> pollEmitterList = polls.get(pollID);
        if (pollEmitterList == null)
            pollEmitterList = new ArrayList<>();

        pollEmitterList.add(emitter);
        polls.put(pollID, pollEmitterList);
        emitter.onCompletion(() -> polls.remove(pollID));
        return emitter;
    }

    @Override
    public void emitVote(Poll poll) {
        List<SseEmitter> pollEmitterList = polls.get(poll.getId());

        if (pollEmitterList != null && !pollEmitterList.isEmpty()) {
            pollEmitterList.forEach(e -> {
                try {
                    e.send(poll);
                } catch (IOException ex) {
                    throw new RuntimeException(ex);
                }
            });
        }
    }

    @Override
    public PollComment addComment(AddCommentRequest addCommentRequest) {
        if (profanityFilterService.containsProfanity(addCommentRequest.getComment())) {
            throw new BadRequestException("Your comment contains inappropriate language.");
        }

        Poll poll = pollRepository.findById(addCommentRequest.getPollID()).orElseThrow(() -> new EntityNotFoundException("Poll not found"));
        User user = userRepository.findByEmail(addCommentRequest.getEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));

        PollComment comment = PollComment.builder()
                .pollID(new ObjectId(poll.getId()))
                .user(user)
                .comment(addCommentRequest.getComment())
                .createTime(Instant.now())
                .build();

        return pollCommentRepository.save(comment);
    }

    @Override
    public void updateComment(UpdateCommentRequest updateCommentRequest) {
        if (profanityFilterService.containsProfanity(updateCommentRequest.getComment())) {
            throw new BadRequestException("Your comment contains inappropriate language.");
        }
        pollCommentRepository.updateComment(updateCommentRequest.getCommentID(), updateCommentRequest.getComment());
    }

    @Override
    public void deleteComment(String commentID) {
        pollCommentRepository.deleteById(commentID);
    }

    @Override
    public PollReply addReply(AddReplyRequest addReplyRequest) {
        if (profanityFilterService.containsProfanity(addReplyRequest.getComment())) {
            throw new BadRequestException("Your comment contains inappropriate language.");
        }

        Poll poll = pollRepository.findById(addReplyRequest.getPollID()).orElseThrow(() -> new EntityNotFoundException("Poll not found"));
        User user = userRepository.findByEmail(addReplyRequest.getEmail()).orElseThrow(() -> new EntityNotFoundException("User not found"));
        PollComment pollComment = pollCommentRepository.findById(addReplyRequest.getCommentID()).orElseThrow(() -> new EntityNotFoundException("Poll comment not found"));

        PollReply reply = PollReply.builder()
                .pollID(new ObjectId(poll.getId()))
                .user(user)
                .comment(addReplyRequest.getComment())
                .createTime(Instant.now())
                .build();

        pollReplyRepository.save(reply);

        pollComment.getReplies().add(reply);

        pollCommentRepository.save(pollComment);

        return reply;
    }

    @Override
    public void updateReply(UpdateReplyRequest updateReplyRequest) {
        if (profanityFilterService.containsProfanity(updateReplyRequest.getReply())) {
            throw new BadRequestException("Your comment contains inappropriate language.");
        }

        PollReply pollReply = pollReplyRepository.findById(updateReplyRequest.getReplyID()).orElseThrow(() -> new EntityNotFoundException("Poll reply not found"));

        pollReply.setComment(updateReplyRequest.getReply());
        pollReplyRepository.save(pollReply);
    }

    @Override
    public void deleteReply(String commentID, String replyID) {
        PollReply pollReply = pollReplyRepository.findById(replyID).orElseThrow(() -> new EntityNotFoundException("Unable to find poll reply"));
        PollComment pollComment = pollCommentRepository.findById(commentID).orElseThrow(() -> new EntityNotFoundException("Unable to find comment"));

        pollComment.getReplies().removeIf(r -> r.getId().equals(replyID));
        pollCommentRepository.save(pollComment);

        pollReplyRepository.delete(pollReply);
    }
}

