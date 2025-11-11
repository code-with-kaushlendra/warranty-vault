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
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/oauth2/**",
                                "/login/**",
                                "/error"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("https://warrantyvault.in/dashboard", true) // 👈 redirect after login
                        .failureUrl("/login?error=true") // optional
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("https://warrantyvault.in/") // 👈 redirect after logout
                        .permitAll()
                );

        return http.build();
    }
}
