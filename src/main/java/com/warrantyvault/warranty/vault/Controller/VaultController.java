package com.warrantyvault.warranty.vault.Controller;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import com.warrantyvault.warranty.vault.Repository.UserRepository;
import com.warrantyvault.warranty.vault.Service.VaultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
    @RequestMapping("/api/vault")
    @CrossOrigin(origins = "*") // or your frontend URL (Netlify later)
    public class VaultController {

        @Autowired
        private VaultService vaultService;

        @Autowired
        private UserRepository userRepository;

        // ✅ Get warranty by ID (for edit)
        @GetMapping("/{id}")
        public ResponseEntity<WarrantyVault> getWarrantyById(@PathVariable Long id) {
            Optional<WarrantyVault> vaultOpt = vaultService.getWarrantyById(id);
            return vaultOpt.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        }

        @PostMapping("/upload")
        public ResponseEntity<?> uploadWarranty(
                @RequestParam("email") String email,
                @RequestParam("productName") String productName,
                @RequestParam("category") String category,
                @RequestParam(value = "brand", required = false) String brand,
                @RequestParam("purchaseDate") String purchaseDate,
                @RequestParam("warrantyExpiry") String warrantyExpiry,
                @RequestParam(value = "serialNumber", required = false) String serialNumber,
                @RequestParam(value = "purchasePrice", required = false) Double purchasePrice,
                @RequestParam(value = "notes", required = false) String notes,
                @RequestParam(value = "warrantyFile", required = false) MultipartFile warrantyFile,
                @RequestParam(value = "additionalFiles", required = false) MultipartFile[] additionalFiles
        ) {
            try {
                var userOpt = userRepository.findByEmail(email);
                if (userOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body("User not found");
                }

                WarrantyVault vault = new WarrantyVault();
                vault.setProductName(productName);
                vault.setCategory(category);
                vault.setBrand(brand);
                vault.setSerialNumber(serialNumber);
                vault.setPurchasePrice(purchasePrice);
                vault.setNotes(notes);
                vault.setEmail(email);

                // Convert string to Date (if needed)
                vault.setPurchaseDate(java.sql.Date.valueOf(purchaseDate));
                vault.setWarrantyExpiry(java.sql.Date.valueOf(warrantyExpiry));

                WarrantyVault savedVault = vaultService.uploadWarranty(vault, warrantyFile, additionalFiles);

                return ResponseEntity.ok(savedVault);

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Error uploading warranty: " + e.getMessage());
            }
        }
        @GetMapping("/list/{email}")
        public ResponseEntity<?> getVaultsByEmail(@PathVariable String email) {
            try {
                var vaults = vaultService.getVaultsByEmail(email);
                return ResponseEntity.ok(vaults);
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Error fetching warranties: " + e.getMessage());
            }
        }

        @DeleteMapping("/delete/{id}")
        public ResponseEntity<?> deleteWarranty(@PathVariable Long id){
            try {
                boolean deleted = vaultService.deleteWarranty(id);
                if (deleted) {
                    return ResponseEntity.ok("Warranty deleted successfully");
                } else {
                    return ResponseEntity.badRequest().body("Warranty not found");
                }
            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Error deleting warranty: " + e.getMessage());
            }
        }

        @PutMapping("/edit/{id}")
        public ResponseEntity<?> editWarranty(@PathVariable Long id,
                                              @RequestParam("productName") String productName,
                                              @RequestParam("category") String category,
                                              @RequestParam(value = "brand", required = false) String brand,
                                              @RequestParam("purchaseDate") String purchaseDate,
                                              @RequestParam("warrantyExpiry") String warrantyExpiry,
                                              @RequestParam(value = "serialNumber", required = false) String serialNumber,
                                              @RequestParam(value = "purchasePrice", required = false) Double purchasePrice,
                                              @RequestParam(value = "notes", required = false) String notes,
                                              @RequestParam(value = "warrantyFile", required = false) MultipartFile warrantyFile){

            try {
                WarrantyVault updatedVault=vaultService.updateWarranty( id, productName,
                        category,
                        brand,
                        purchaseDate,
                        warrantyExpiry,
                        serialNumber,
                        purchasePrice,
                        notes,
                        warrantyFile);
                return  ResponseEntity.ok(updatedVault);

            }catch (Exception e){
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Error updating warranty: " + e.getMessage());
            }

        }
    }
