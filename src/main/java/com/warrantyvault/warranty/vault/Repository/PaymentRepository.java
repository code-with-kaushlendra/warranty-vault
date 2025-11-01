package com.warrantyvault.warranty.vault.Repository;

import com.warrantyvault.warranty.vault.Entity.Payment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PaymentRepository extends MongoRepository<Payment,String> {
    Payment findByOrderId(String orderId);
}
