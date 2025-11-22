package com.warrantyvault.warranty.vault.Controller;


import com.warrantyvault.warranty.vault.Entity.UserMessageRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;


@RestController
@RequestMapping("/api")
@CrossOrigin(origins="*")
public class ChatbotController {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;


    public ChatbotController() {
        this.webClient = WebClient.builder().build();
    }

    @PostMapping("/chat")
    public ResponseEntity<?> getAPI(@RequestBody UserMessageRequest request){

        String url="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

        String body = """
                {
                  "contents":[
                    {
                      "parts":[{"text":"%s"}]
                    }
                  ]
                }
                """.formatted(request.getMessage());


        Mono<String> responseMono = webClient.post()
                .uri(url)
                .header("Content-Type", "application/json")
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class);

        String response = responseMono.block(); // blocking for simplicity
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}





