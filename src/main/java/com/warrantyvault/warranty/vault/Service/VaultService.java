package com.warrantyvault.warranty.vault.Service;

import com.warrantyvault.warranty.vault.Entity.WarrantyVault;
import com.warrantyvault.warranty.vault.Repository.WarrantyVaultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface VaultService {



    WarrantyVault uploadWarranty(WarrantyVault vaultData,
                                 MultipartFile warrantyFile,
                                 MultipartFile[] additionalFiles) throws IOException;


    public List<WarrantyVault> getWarrantiesByEmail(String email) ;

    public List<WarrantyVault> getVaultsByEmail(String email);

    boolean deleteWarranty(Long id);

    WarrantyVault updateWarranty(Long id, String productName, String category, String brand,
                                 String purchaseDate, String warrantyExpiry, String serialNumber,
                                 Double purchasePrice, String notes, MultipartFile warrantyFile) throws Exception;

    Optional<WarrantyVault> getWarrantyById(Long id);




}
