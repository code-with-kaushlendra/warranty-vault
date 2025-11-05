package com.warrantyvault.warranty.vault.Entity;


import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;



import java.time.LocalDateTime;



@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name="payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // ✅ Primary key required
    private  String email;
    private  String orderId;
    private  String paymentId;
    private String planType;
    private double amount;
    private  String status;
    private long timestamp;

    @CreatedDate
    private LocalDateTime created_at;

    @CreatedDate
    private LocalDateTime updated_at;

    @PrePersist
    protected void onCreate() {
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();

    }


    @PreUpdate
    protected void onUpdate() {
        this.updated_at = LocalDateTime.now();
    }

    public Payment(String email, String orderId, double amount, String planType) {
        this.email = email;
        this.orderId = orderId;
        this.amount = amount;
        this.planType = planType;
        this.status = "CREATED";
        this.timestamp = System.currentTimeMillis();
    }




}
