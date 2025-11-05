package com.warrantyvault.warranty.vault.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.annotation.CreatedDate;

import org.springframework.data.annotation.LastModifiedDate;

import javax.annotation.processing.Generated;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ✅ Primary key required
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private String planType="FREE";

    private LocalDate planStartDate;
    private LocalDate planExpiryDate;


    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime  updatedAt;


}
