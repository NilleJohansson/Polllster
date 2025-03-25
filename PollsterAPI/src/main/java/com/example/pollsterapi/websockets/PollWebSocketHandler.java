package com.example.pollsterapi.websockets;

import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

// TODO: Add class tags
//@Component
//@ServerEndpoint("/polls/{pollID}")
public class PollWebSocketHandler {
    private static final ConcurrentHashMap<String, Set<Session>> pollSessions = new ConcurrentHashMap<>();
    private final KafkaTemplate<String, String> kafkaTemplate;

    public PollWebSocketHandler(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("pollID") String pollID) {
        pollSessions.computeIfAbsent(pollID, k -> new CopyOnWriteArraySet<>()).add(session);
        System.out.println("New connection for poll: " + pollID);
    }

    @OnClose
    public void onClose(Session session, @PathParam("pollID") String pollID) {
        pollSessions.getOrDefault(pollID, Set.of()).remove(session);
        System.out.println("Connection closed for poll: " + pollID);
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        System.err.println("WebSocket error: " + throwable.getMessage());
        throwable.printStackTrace();
    }

    @KafkaListener(topics = "poll-votes", groupId = "poll-group")
    public void onVoteReceived(String message) {
        String[] parts = message.split(":");
        if (parts.length != 2) return;

        String pollID = parts[0];
        String vote = parts[1];

        // Notify all WebSocket clients listening to this pollID
        Set<Session> sessions = pollSessions.getOrDefault(pollID, Set.of());
        sessions.forEach(session -> {
            try {
                session.getBasicRemote().sendText(vote);
            } catch (Exception e) {
                sessions.remove(session); // Remove disconnected clients
                System.err.println("Failed to send message to a client: " + e.getMessage());
            }
        });
    }

    // Kafka producer to publish new votes
    public void publishVote(String pollID, String vote) {
        String message = pollID + ":" + vote; // Format: "pollID:vote"
        kafkaTemplate.send("poll-votes", message);
        System.out.println("Vote published to Kafka for poll " + pollID + ": " + vote);
    }

}
