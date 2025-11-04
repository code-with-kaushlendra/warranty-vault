package com.warrantyvault.warranty.vault.Controller;


import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.warrantyvault.warranty.vault.Repository.PaymentRepository;
import com.warrantyvault.warranty.vault.Service.PaymentService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PaymentController {


  @Autowired
   private PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam String email, @RequestParam int amount , @RequestParam String planType){
                      JSONObject order=paymentService.createOrder(email,amount,planType);
                      return ResponseEntity.ok(order.toMap());
    }


    @PostMapping("/verify")
    public String verifyPayment(@RequestBody String  payload) {

        JSONObject json=new JSONObject(payload);
        return paymentService.verifyPayment(json);
    }
}
