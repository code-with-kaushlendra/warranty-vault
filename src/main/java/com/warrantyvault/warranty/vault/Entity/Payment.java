package com.warrantyvault.warranty.vault.Entity;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "payments")
public class Payment {
    @Id
    private String id;
    private  String email;
    private  String orderId;
    private  String paymentId;
    private String planType;
    private double amount;
    private  String status;
    private long timestamp;

    public Payment(String email, String orderId, double amount, String planType) {
        this.email = email;
        this.orderId = orderId;
        this.amount = amount;
        this.planType = planType;
        this.status = "CREATED";
        this.timestamp = System.currentTimeMillis();
    }

    @CreatedDate
    private LocalDateTime createdAt;


}
