package com.warrantyvault.warranty.vault.Controller;

import com.warrantyvault.warranty.vault.Entity.User;
import com.warrantyvault.warranty.vault.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@RequestBody User user) {

        userService.createUser(user);


        return ResponseEntity.ok(Map.of("message", "User Added Successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User dbuser = userService.loginUser(user);

        Map<String, Object> response = new HashMap();
        if (dbuser != null) {
            response.put("success", true);
            response.put("message", "Login Successfull");
            response.put("email", dbuser.getEmail());
            response.put("firstName", dbuser.getFirstName());
            response.put("lastName", dbuser.getLastName());
            response.put("planType", dbuser.getPlanType());
            response.put("planExpiryDate", dbuser.getPlanExpiryDate());
            response.put("phone", dbuser.getPhone());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("messsage", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }


        // ✅ NEW: Google Sign-In
        @PostMapping("/google-login")
        public ResponseEntity<?> googleLogin (@RequestBody Map < String, String > payload){
            String token = payload.get("token");
            try {
                // Step 1: Verify token using Google API
                String googleUrl = "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" + token;
                RestTemplate restTemplate = new RestTemplate();
                Map<String, Object> googleData = restTemplate.getForObject(googleUrl, Map.class);

                if (googleData == null || googleData.get("email") == null) {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("success", false, "message", "Invalid Google token"));
                }

                String email = googleData.get("email").toString();
                String name = googleData.get("name") != null ? googleData.get("name").toString() : "";
                String picture = googleData.get("picture") != null ? googleData.get("picture").toString() : "";

                // Step 2: Check if user already exists
                User user = userService.findByEmail(email);

                // Step 3: If not, create new user
                if (user == null) {
                    user = new User();
                    user.setEmail(email);
                    user.setFirstName(name);
                    user.setPassword("GOOGLE_AUTH"); // dummy placeholder
                    user.setPlanType("FREE");
                    user.setPlanStartDate(LocalDate.now());
                    user.setPlanExpiryDate(LocalDate.now().plusMonths(1)); // Free trial month
                    userService.createGoogleUser(user);
                }

                // Step 4: Prepare response
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Google login successful");
                response.put("email", user.getEmail());
                response.put("firstName", user.getFirstName());
                response.put("planType", user.getPlanType());
                response.put("planExpiryDate", user.getPlanExpiryDate());
                return ResponseEntity.ok(response);

            } catch (Exception e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("success", false, "message", "Error verifying Google login"));
            }


        }
    }









