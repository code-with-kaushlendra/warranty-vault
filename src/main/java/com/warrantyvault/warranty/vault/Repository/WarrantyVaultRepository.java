package com.warrantyvault.warranty.vault.Repository;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface WarrantyVaultRepository extends MongoRepository<WarrantyVault, String> {
  Optional<WarrantyVault> findByEmail(String email);
}
