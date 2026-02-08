package com.arc.services;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalLoggerService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String LOGGER_URL = "http://localhost:5000/";

    public void log(String message) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_PLAIN);

            HttpEntity<String> request = new HttpEntity<>(message, headers);
            
            // Fire and forget (in a real app, this might be async)
            restTemplate.postForObject(LOGGER_URL, request, String.class);
            System.out.println("Logged to external service: " + message);
        } catch (Exception e) {
            // Silently fail or log to console if external logger is down
            System.err.println("Failed to log to external service: " + e.getMessage());
        }
    }
}
