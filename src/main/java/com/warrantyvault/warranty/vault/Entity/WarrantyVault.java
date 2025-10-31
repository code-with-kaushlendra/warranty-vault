package com.warrantyvault.warranty.vault.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "warrantyvault")
public class WarrantyVault {

    @Id
    private String id;

    private String productName;
    private String category;
    private String brand;
    private Date purchaseDate;
    private Date warrantyExpiry;
    private String serialNumber;
    private Double purchasePrice;
    private String notes;
    private String email;

    private String warrantyFilePath; // Path where file is stored
    private String[] additionalFilesPath; // Multiple files

    private Date uploadedAt = new Date();
}
