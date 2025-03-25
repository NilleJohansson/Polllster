package com.example.pollsterapi.services;

public interface S3Service {
    String uploadFile(String key, byte[] fileDate, String contentType);

    String getPublicURL(String key);
}
