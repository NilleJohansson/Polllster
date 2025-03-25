package com.example.pollsterapi.services;

import com.example.pollsterapi.exceptions.EntityNotFoundException;
import com.example.pollsterapi.models.documents.Draft;
import com.example.pollsterapi.models.documents.User;
import com.example.pollsterapi.payload.request.CreateDraftRequest;
import com.example.pollsterapi.repository.DraftRepository;
import com.example.pollsterapi.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class PollServiceImplTest {
    @Mock
    private UserRepository userRepository;

    @Mock
    private DraftRepository draftRepository;

    @InjectMocks
    private PollServiceImpl pollService;

    @Mock
    private UserDetails userDetails;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private ModelMapper modelMapper;

    @BeforeEach
    void setUp() {

    }

    @Test
    void testSaveDraft() {
        // Mock SecurityContext and Authentication
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn("mockedUser");

        // Set the mocked SecurityContext
        SecurityContextHolder.setContext(securityContext);

        // Arrange
        CreateDraftRequest request = new CreateDraftRequest();
        request.setTitle("Sample Draft");

        User user = new User();
        user.setId("user123");
        user.setUsername("testUser");

        when(securityContext.getAuthentication().getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("testUser");
        when(userRepository.findByUsername("testUser")).thenReturn(Optional.of(user));

        Draft draft = new Draft();
        draft.setUserID("user123");

        // Mock the ModelMapper behavior
        when(modelMapper.map(request, Draft.class)).thenReturn(draft);

        // Act
        pollService.saveDraft(request);

        // Assert
        verify(draftRepository, times(1)).save(any(Draft.class));
    }

    @Test
    void testDeleteDraft_DraftExists_DeletesDraft() {
        // Arrange
        String draftID = "draft123";
        Draft draft = new Draft();
        draft.setId(draftID);

        when(draftRepository.findById(draftID)).thenReturn(Optional.of(draft));


        // Act
        pollService.deleteDraft(draftID);

        // Assert
        verify(draftRepository, times(1)).deleteById(draftID);
    }

    @Test
    void testDeleteDraft_DraftNotExists_ThrowsException() {
        // Arrange
        String draftID = "draft123";
        when(draftRepository.findById(draftID)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(EntityNotFoundException.class, () -> pollService.deleteDraft(draftID));
        verify(draftRepository, never()).deleteById(draftID);
    }
}
