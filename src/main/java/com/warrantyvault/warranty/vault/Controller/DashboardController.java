package com.warrantyvault.warranty.vault.Controller;


import com.warrantyvault.warranty.vault.Entity.User;
import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import com.warrantyvault.warranty.vault.Repository.UserRepository;
import com.warrantyvault.warranty.vault.Repository.WarrantyVaultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WarrantyVaultRepository vaultRepository;

    // ✅ Get user profile data
    @GetMapping("/user/{email}")
    public ResponseEntity<?> getUserDetails(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isEmpty()) {

            return ResponseEntity.badRequest().body("User not found");
        }
        return ResponseEntity.ok(user.get());
    }

    // ✅ Get all warranties uploaded by the user
    @GetMapping("/vaults/{email}")
    public ResponseEntity<?> getUserVaults(@PathVariable String email) {
        Optional<WarrantyVault> vaults = vaultRepository.findByEmail(email);
        return ResponseEntity.ok(vaults);
    }

    // ✅ Get plan info (static for now)
    @GetMapping("/plan/{email}")
    public ResponseEntity<?> getUserPlan(@PathVariable String email) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // You can store user plan in User entity later
        String plan = "Free";
        return ResponseEntity.ok(plan);
    }

}
