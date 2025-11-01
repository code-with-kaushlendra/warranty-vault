package com.warrantyvault.warranty.vault.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class FileResourceConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Map URL path /uploads/** to the actual folder on disk
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/"); // path relative to project root
    }
}
