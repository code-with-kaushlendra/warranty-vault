package com.warrantyvault.warranty.vault.Service;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import com.warrantyvault.warranty.vault.Repository.WarrantyVaultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class VaultServiceImpl  implements  VaultService {

    @Autowired
    private WarrantyVaultRepository vaultRepository;

    private static final String UPLOAD_DIR = "uploads/";

    @Override
    public WarrantyVault uploadWarranty(WarrantyVault vaultData,
                                        MultipartFile warrantyFile,
                                        MultipartFile[] additionalFiles) throws IOException {

        // Ensure upload folder exists
        File uploadFolder = new File(UPLOAD_DIR);
        if (!uploadFolder.exists()) {
            uploadFolder.mkdirs();
        }

        // Save main warranty file
        if (warrantyFile != null && !warrantyFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + warrantyFile.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            Files.write(filePath, warrantyFile.getBytes());
            vaultData.setWarrantyFilePath(filePath.toString());
        }

        // Save additional files
        if (additionalFiles != null && additionalFiles.length > 0) {
            List<String> filePaths = new ArrayList<>();
            for (MultipartFile file : additionalFiles) {
                if (!file.isEmpty()) {
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(UPLOAD_DIR, fileName);
                    Files.write(filePath, file.getBytes());
                    filePaths.add(filePath.toString());
                }
            }
            vaultData.setAdditionalFilesPath(filePaths.toArray(new String[0]));
        }

        // Save to MongoDB
        return vaultRepository.save(vaultData);
    }

    @Override
    public List<WarrantyVault> getWarrantiesByEmail(String email) {
        return vaultRepository.findByEmail(email);
    }

    @Override
    public List<WarrantyVault> getVaultsByEmail(String email) {
        return vaultRepository.findByEmail(email);
    }

    @Override
    public boolean deleteWarranty(Long id) {
        Optional<WarrantyVault> vaultOpt = vaultRepository.findById(id);
        if (vaultOpt.isPresent()) {
            vaultRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public WarrantyVault updateWarranty(Long id, String productName, String category, String brand, String purchaseDate, String warrantyExpiry, String serialNumber, Double purchasePrice, String notes, MultipartFile warrantyFile) throws Exception {
        Optional<WarrantyVault> optionalVault = vaultRepository.findById(id);
        if (optionalVault.isEmpty()) {
            throw new Exception("Warranty not found with id: " + id);
        }

        WarrantyVault vault = optionalVault.get();
        vault.setProductName(productName);
        vault.setCategory(category);
        vault.setBrand(brand);
        vault.setSerialNumber(serialNumber);
        vault.setPurchasePrice(purchasePrice);
        vault.setNotes(notes);

        vault.setPurchaseDate(Date.valueOf(purchaseDate));
        vault.setWarrantyExpiry(Date.valueOf(warrantyExpiry));


        // Handle updated warranty file (if uploaded)
        if (warrantyFile != null && !warrantyFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + warrantyFile.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, fileName);
            Files.write(filePath, warrantyFile.getBytes());
            vault.setWarrantyFilePath(filePath.toString());
        }

        return vaultRepository.save(vault);
    }

    @Override
    public Optional<WarrantyVault> getWarrantyById(Long id) {
        return vaultRepository.findById(id);
    }



}
