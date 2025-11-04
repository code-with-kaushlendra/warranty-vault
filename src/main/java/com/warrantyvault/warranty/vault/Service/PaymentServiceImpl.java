package com.warrantyvault.warranty.vault.Service;


import com.razorpay.Order;
import com.warrantyvault.warranty.vault.Entity.Payment;
import com.razorpay.RazorpayClient;
import com.warrantyvault.warranty.vault.Entity.User;
import com.warrantyvault.warranty.vault.Repository.PaymentRepository;
import com.warrantyvault.warranty.vault.Repository.UserRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.Optional;

@Service
public class PaymentServiceImpl implements PaymentService{

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public JSONObject createOrder(String email, double amount, String planType) {
        try {
            // --- 1️⃣ Build request JSON
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

            // --- 2️⃣ Prepare Basic Auth Header
            String auth = razorpayKeyId.trim() + ":" + razorpayKeySecret.trim();
            String base64Auth = Base64.getEncoder().encodeToString(auth.getBytes());

            // --- 3️⃣ Create HTTPS connection manually
            java.net.URL url = new java.net.URL("https://api.razorpay.com/v1/orders");
            java.net.HttpURLConnection conn = (java.net.HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Authorization", "Basic " + base64Auth);
            conn.setDoOutput(true);

            try (java.io.OutputStream os = conn.getOutputStream()) {
                byte[] input = orderRequest.toString().getBytes();
                os.write(input, 0, input.length);
            }

            // --- 4️⃣ Read response
            StringBuilder responseStr = new StringBuilder();
            try (java.io.BufferedReader br = new java.io.BufferedReader(
                    new java.io.InputStreamReader(conn.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    responseStr.append(line);
                }
            }

            JSONObject order = new JSONObject(responseStr.toString());

            // --- 5️⃣ Save payment record
            Payment record = new Payment(email, order.getString("id"), amount, planType);
            paymentRepository.save(record);

            // --- 6️⃣ Prepare response
            JSONObject response = new JSONObject();
            response.put("id", order.getString("id"));
            response.put("amount", order.getDouble("amount") / 100.0); // convert back to INR
            response.put("currency", order.getString("currency"));
            response.put("email", email);
            response.put("planType", planType);

            return response;

        } catch (Exception e) {
            JSONObject error = new JSONObject();
            error.put("error", e.getMessage());
            e.printStackTrace();
            return error;
        }
    }

    @Override
    public String verifyPayment(JSONObject payload) {
        try {
            String orderId = payload.getString("order_id");
            String paymentId = payload.getString("payment_id");
            String email = payload.getString("email");

            Payment record = paymentRepository.findByOrderId(orderId);
            if (record != null) {
                record.setPaymentId(paymentId);
                record.setStatus("SUCCESS");
                paymentRepository.save(record);

                // Update user's plan type
                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    User user=userOpt.get();
                    user.setPlanType(record.getPlanType());
                    userRepository.save(user);
                }
            }

            return "{\"status\":\"success\"}";
        } catch (Exception e) {
            return "{\"error\":\"" + e.getMessage() + "\"}";
        }
    }
}
