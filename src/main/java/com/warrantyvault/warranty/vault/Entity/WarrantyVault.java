package com.warrantyvault.warranty.vault.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="warrantyvault")
public class WarrantyVault {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // ✅ Primary key required

    private String productName;
    private String category;
    private String brand;
    private Date purchaseDate;
    private Date warrantyExpiry;
    private String serialNumber;
    private Double purchasePrice;
    private String notes;
    private String email;
    private boolean reminderSent=false;

    private String warrantyFilePath; // Path where file is stored
    private String[] additionalFilesPath; // Multiple files

    private Date uploadedAt = new Date();
}
