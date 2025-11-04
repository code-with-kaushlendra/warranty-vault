package com.warrantyvault.warranty.vault.Service;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import com.warrantyvault.warranty.vault.Repository.WarrantyVaultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;


@Service
public class ReminderService {

    @Autowired
    private WarrantyVaultRepository vaultRepository;

    @Autowired
    private EmailService emailService;

    // Run every day at 9 AM
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendExpiryReminders() {
        LocalDate today = LocalDate.now();
        LocalDate upcoming = today.plusDays(3);


        Date start = java.sql.Date.valueOf(today);
        Date end = java.sql.Date.valueOf(upcoming);

        List<WarrantyVault> expiringSoon = vaultRepository
                .findByWarrantyExpiryBetweenAndReminderSentFalse(start,end);

        for (WarrantyVault vault : expiringSoon) {
            String subject = "Warranty Expiry Reminder";
            String message = "Hi,\n\nYour warranty for " + vault.getProductName() +
                    " is expiring on " + vault.getWarrantyExpiry() + ".\n\nBest,\nWarranty Vault Team";

            emailService.sendEmail(vault.getEmail(), subject, message);

            vault.setReminderSent(true);
            vaultRepository.save(vault);
        }

        System.out.println("Sent " + expiringSoon.size() + " expiry reminders.");
    }
}
