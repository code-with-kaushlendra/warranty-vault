package com.warrantyvault.warranty.vault.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {




        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http
                    .csrf(csrf -> csrf.disable())  // disable CSRF (optional for APIs)
                    .authorizeHttpRequests(auth -> auth
                            .anyRequest().permitAll()  // allow all requests without login
                    )
                    .formLogin(login -> login.disable()) // disable login form
                    .httpBasic(basic -> basic.disable()); // disable basic auth

            return http.build();
        }
    }


