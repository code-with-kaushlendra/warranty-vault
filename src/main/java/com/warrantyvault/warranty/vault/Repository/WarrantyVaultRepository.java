package com.warrantyvault.warranty.vault.Repository;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface WarrantyVaultRepository extends JpaRepository<WarrantyVault, Long> {
  List<WarrantyVault> findByEmail(String email);


  List<WarrantyVault> findByWarrantyExpiryBetweenAndReminderSentFalse(Date start, Date end);
}
