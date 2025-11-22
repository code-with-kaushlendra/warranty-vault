package com.warrantyvault.warranty.vault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableJpaAuditing  // ✅ Enables automatic timestamps for JPA
@SpringBootApplication
@EnableScheduling
@EnableTransactionManagement
public class WarrantyVaultApplication {

	public static void main(String[] args) {
		SpringApplication.run(WarrantyVaultApplication.class, args);
	}
}
