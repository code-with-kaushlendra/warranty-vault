package com.warrantyvault.warranty.vault.Service;

import org.json.JSONObject;

public interface PaymentService {
    JSONObject createOrder(String email, double amount, String planType);
    String verifyPayment(JSONObject payload);
}
