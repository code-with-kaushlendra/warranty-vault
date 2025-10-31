package com.warrantyvault.warranty.vault.Service;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface VaultService {
    WarrantyVault uploadWarranty(WarrantyVault vaultData,
                                 MultipartFile warrantyFile,
                                 MultipartFile[] additionalFiles) throws IOException;

}
