package com.warrantyvault.warranty.vault.Service;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import com.warrantyvault.warranty.vault.Repository.WarrantyVaultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface VaultService {



    WarrantyVault uploadWarranty(WarrantyVault vaultData,
                                 MultipartFile warrantyFile,
                                 MultipartFile[] additionalFiles) throws IOException;


    public List<WarrantyVault> getWarrantiesByEmail(String email) ;

}
