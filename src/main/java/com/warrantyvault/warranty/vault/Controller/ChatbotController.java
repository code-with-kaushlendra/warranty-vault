package com.warrantyvault.warranty.vault.Controller;


import com.warrantyvault.warranty.vault.Entity.UserMessageRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ChatbotController {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody UserMessageRequest request) {

        String url = "/v1beta/models/gemini-2.5-flash:generateContent?key=" + "AIzaSyB_Rekfbo-XEs1vwkEwiNvTyV0BUjC1ZiI";

        String body = """
                {
                  "contents": [
                    {
                      "parts": [
                        { "text": "%s" }
                      ]
                    }
                  ]
                }
                """.formatted(request.getMessage());

        try {
            String response = webClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();


            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("Exception is : " + e);
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }
}
