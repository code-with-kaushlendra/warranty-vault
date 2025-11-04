package com.warrantyvault.warranty.vault.Repository;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface WarrantyVaultRepository extends MongoRepository<WarrantyVault, String> {
  List<WarrantyVault> findByEmail(String email);

  @Query("{ 'warrantyExpiry': { $gte: ?0, $lte: ?1 }, 'reminderSent': false }")
  List<WarrantyVault> findByWarrantyExpiryBetweenAndReminderSentFalse(Date start, Date end);
}
