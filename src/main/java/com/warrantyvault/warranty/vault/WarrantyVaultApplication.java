package com.warrantyvault.warranty.vault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@EnableMongoAuditing
@SpringBootApplication
public class WarrantyVaultApplication {

	public static void main(String[] args) {
		SpringApplication.run(WarrantyVaultApplication.class, args);
	}

}
