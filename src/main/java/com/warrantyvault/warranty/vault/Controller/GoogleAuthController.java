package com.warrantyvault.warranty.vault.Controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/google")
public class GoogleAuthController {

    @GetMapping("/success")
    public ResponseEntity<?> loginSuccess(@AuthenticationPrincipal OAuth2User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated"));
        }

        String name = user.getAttribute("name");
        String email = user.getAttribute("email");

        // ✅ Encode query parameters to avoid IllegalArgumentException
        String encodedName = URLEncoder.encode(name, StandardCharsets.UTF_8);
        String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);

        String redirectUrl = "https://warrantyvault.in/dashboard.html?name="
                + encodedName + "&email=" + encodedEmail;

        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(redirectUrl))
                .build();
    }
}
