package com.warrantyvault.warranty.vault.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.annotation.processing.Generated;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private  String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String password;
    private String planType="FREE";


    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime  updatedAt;


}
