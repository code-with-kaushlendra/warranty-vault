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
        LocalDate upcoming = today.plusDays(40); // test window

        Date start = java.sql.Date.valueOf(today);
        Date end = java.sql.Date.valueOf(upcoming);

        System.out.println("Checking between: " + start + " and " + end);

        List<WarrantyVault> all = vaultRepository.findByWarrantyExpiryBetweenAndReminderSentFalse(start, end);
        System.out.println("Found warranties count: " + all.size());

// Debug: print all emails
        for (WarrantyVault w : all) {
            System.out.println("DB email: '" + w.getEmail() + "'");
            System.out.println("Comparing with request email: '" + email + "'");
        }


        // ✅ Make sure filtering is strict but safe
        List<WarrantyVault> filtered = all.stream()
                .filter(w -> w.getEmail() != null &&
                        w.getEmail().trim().equalsIgnoreCase(email.trim()))
                .collect(Collectors.toList());

        System.out.println("Filtered warranties for " + email + ": " + filtered.size());
        return filtered;
    }


}
