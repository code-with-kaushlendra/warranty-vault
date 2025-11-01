package com.warrantyvault.warranty.vault.Entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    private  String userEmail;
    private  String orderId;
    private  String paymentId;
    private double amount;
    private  String status;
    private String planType;
    private long timestamp;
}
