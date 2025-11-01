package com.warrantyvault.warranty.vault.Controller;


import com.warrantyvault.warranty.vault.Repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {

        @Value("${razorpay.key.id}")
       private String razorpayKeyId;

        @Value("${razorpay.key.secret}")
       private String razorpayKeySecret;

        private PaymentRepository paymentRepository;
}
