package com.warrantyvault.warranty.vault.Repository;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface WarrantyVaultRepository extends MongoRepository<WarrantyVault, String> {
  List<WarrantyVault> findByEmail(String email);
}
