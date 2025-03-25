package com.example.pollsterapi.serializers;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public class ResponseEntitySerializer extends StdSerializer<ResponseEntity<?>> {

    public ResponseEntitySerializer() {
        super((Class<ResponseEntity<?>>) (Class<?>) ResponseEntity.class);
    }
    @Override
    public void serialize(ResponseEntity<?> value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartObject();
        gen.writeObjectField("body", value.getBody());
        gen.writeObjectField("headers", new HttpHeadersWrapper(value.getHeaders()));
        gen.writeObjectField("statusCode", value.getStatusCodeValue());
        gen.writeEndObject();
    }

    public static class HttpHeadersWrapper {
        private final HttpHeaders headers;

        public HttpHeadersWrapper(HttpHeaders headers) {
            this.headers = headers;
        }

        public HttpHeaders getHeaders() {
            return headers;
        }
    }
}
