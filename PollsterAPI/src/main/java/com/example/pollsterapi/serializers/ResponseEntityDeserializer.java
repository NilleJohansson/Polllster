package com.example.pollsterapi.serializers;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;


public class ResponseEntityDeserializer extends StdDeserializer<ResponseEntity<?>> {

    public ResponseEntityDeserializer() {
        this(null);
    }

    public ResponseEntityDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public ResponseEntity<?> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        ObjectMapper mapper = (ObjectMapper) p.getCodec();
        JsonNode node = mapper.readTree(p);

        // Deserialize body, headers, and status code
        JsonNode bodyNode = node.get("body");
        JsonNode headersNode = node.get("headers");
        JsonNode statusCodeNode = node.get("statusCode");

        // Convert body to the appropriate type (e.g., using mapper.treeToValue)
        Object body = mapper.treeToValue(bodyNode, Object.class);

        // Convert headers to HttpHeaders
        HttpHeaders headers = mapper.treeToValue(headersNode, HttpHeaders.class);

        // Convert status code to HttpStatus
        HttpStatus status = HttpStatus.valueOf(statusCodeNode.asInt());

        return new ResponseEntity<>(body, headers, status);
    }
}
