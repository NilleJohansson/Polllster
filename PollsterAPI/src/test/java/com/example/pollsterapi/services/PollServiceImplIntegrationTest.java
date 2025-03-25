//package com.example.pollsterapi.services;
//
//import com.example.pollsterapi.models.documents.User;
//import com.example.pollsterapi.payload.request.CreateDraftRequest;
//import com.example.pollsterapi.payload.request.CreatePollRequest;
//import com.example.pollsterapi.repository.PollRepository;
//import com.example.pollsterapi.repository.UserRepository;
//import de.flapdoodle.embed.mongo.MongodExecutable;
//import de.flapdoodle.embed.mongo.MongodProcess;
//import de.flapdoodle.embed.mongo.MongodStarter;
//import de.flapdoodle.embed.mongo.config.MongodConfigBuilder;
//import de.flapdoodle.embed.mongo.config.Net;
//import de.flapdoodle.embed.mongo.distribution.Version;
//import org.junit.jupiter.api.AfterAll;
//import org.junit.jupiter.api.BeforeAll;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.context.ActiveProfiles;
//import org.springframework.test.context.junit.jupiter.SpringExtension;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.Optional;
//
//import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
//
//@SpringBootTest
//@ExtendWith(SpringExtension.class)
//@ActiveProfiles("test")
////@Transactional("")
//public class PollServiceImplIntegrationTest {
//
//    @Autowired
//    private PollServiceImpl pollService;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PollRepository pollRepository;
//
//    private User testUser;
//
//    @BeforeEach
//    void setUp() {
//        // Initialize a test user to be used across tests
//        testUser = new User();
//        testUser.setUsername("testUser");
//        testUser.setId("user123");
//        userRepository.save(testUser);
//    }
//
//    @Test
//    @WithMockUser(username = "testUser", roles = {"USER"}) // Mock the authenticated user
//    void testSavePoll_createsPoll() {
//        // Given
//        CreatePollRequest createPollRequest = new CreatePollRequest();
//        createPollRequest.setTitle("Test Poll");
//        createPollRequest.setDescription("A test poll");
//        // Add other necessary fields from the CreatePollRequest object here
//
//        // When
//        pollService.savePoll(createPollRequest);
//
//        // Then
//        Optional<User> savedUser = userRepository.findById(testUser.getId());
//        assertThat(savedUser).isPresent();
//        assertThat(savedUser.get().getUsername()).isEqualTo("testUser");
//
//        // Optionally verify that poll was created
//        assertThat(pollRepository.count()).isGreaterThan(0);
//    }
//
//    @Test
//    @WithMockUser(username = "testUser", roles = {"USER"}) // Mock the authenticated user
//    void testGetPollById_returnsPoll() {
//        // Given
//        // First, create a poll and associate it with a user
//        CreatePollRequest createPollRequest = new CreatePollRequest();
//        createPollRequest.setTitle("Poll 1");
//        createPollRequest.setDescription("Description of Poll 1");
//
//        pollService.savePoll(createPollRequest);
//
//        // When
//        // Assuming getPollById retrieves a poll by its ID
//        // Retrieve it using PollRepository (or PollService if that is what you'd use)
//        String pollId = "pollId";  // Use an actual poll ID from the saved poll
//        var poll = pollRepository.findById(pollId);
//
//        // Then
//        assertThat(poll).isPresent();
//        assertThat(poll.get().getTitle()).isEqualTo("Poll 1");
//    }
//
//    @Test
//    @WithMockUser(username = "testUser", roles = {"USER"}) // Mock the authenticated user
//    void testDeleteDraft_removesDraft() {
//        // Given: create and save a draft in the system
//        CreateDraftRequest createDraftRequest = new CreateDraftRequest();
//        createDraftRequest.setTitle("Draft Poll");
//        createDraftRequest.setDescription("A test draft poll");
//        pollService.saveDraft(createDraftRequest);
//
//        // Given: a draft is saved in the system
//        // Create and save a draft (you need to implement this in your service)
//        String draftId = "draft123"; // example draft ID
//
//        // When: delete it
//        pollService.deleteDraft(draftId);
//
//        // Then: verify that the draft was deleted (or check that an exception is thrown if draft doesn't exist)
//        Optional<User> user = userRepository.findById(testUser.getId());
//        assertThat(user).isEmpty(); // Or verify that the draft is deleted
//    }
//}