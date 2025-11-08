package com.warrantyvault.warranty.vault.Controller;


import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import com.warrantyvault.warranty.vault.Repository.WarrantyVaultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reminders")
@CrossOrigin("*")
public class ReminderController {

    @Autowired
    private WarrantyVaultRepository vaultRepository;


    @GetMapping("/expiring/{email}")
    public List<WarrantyVault> getExpiringWarranties(@PathVariable String email) {
        LocalDate today = LocalDate.now();
        LocalDate upcoming = today.plusDays(40);

        Date todayDate = java.sql.Date.valueOf(today);
        Date upcomingDate = java.sql.Date.valueOf(upcoming);

        List<WarrantyVault> expired = vaultRepository.findByEmailIgnoreCaseAndWarrantyExpiryBefore(email, todayDate);
        List<WarrantyVault> expiringSoon = vaultRepository.findByEmailIgnoreCaseAndWarrantyExpiryBetween(email, todayDate, upcomingDate);

        // Combine both lists
        expired.addAll(expiringSoon);
        System.out.println("Total warranties (expired + upcoming): " + expired.size());
        return expired;
    }



}
