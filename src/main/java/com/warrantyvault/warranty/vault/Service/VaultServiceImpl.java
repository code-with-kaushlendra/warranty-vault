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
import java.util.ArrayList;
import java.util.List;


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
}
