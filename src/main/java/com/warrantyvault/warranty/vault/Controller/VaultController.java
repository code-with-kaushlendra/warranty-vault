package com.warrantyvault.warranty.vault.Controller;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import com.warrantyvault.warranty.vault.Service.VaultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

    @RestController
    @RequestMapping("/api/vault")
    @CrossOrigin(origins = "*") // or your frontend URL (Netlify later)
    public class VaultController {

        @Autowired
        private VaultService vaultService;

        @PostMapping("/upload")
        public ResponseEntity<?> uploadWarranty(
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
                WarrantyVault vault = new WarrantyVault();
                vault.setProductName(productName);
                vault.setCategory(category);
                vault.setBrand(brand);
                vault.setSerialNumber(serialNumber);
                vault.setPurchasePrice(purchasePrice);
                vault.setNotes(notes);

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
}
