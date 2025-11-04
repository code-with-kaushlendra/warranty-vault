package com.warrantyvault.warranty.vault.Controller;

import com.warrantyvault.warranty.vault.Entity.User;
import com.warrantyvault.warranty.vault.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class UserController {

    @Autowired
     private UserService userService;

        @PostMapping("/register")
        public ResponseEntity<?> createUser(@RequestBody User user){

            userService.createUser(user);


            return ResponseEntity.ok(Map.of("message", "User Added Successfully"));
        }

        @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user){
          User dbuser=  userService.loginUser(user);

          Map<String,Object> response=new HashMap();
            if(dbuser != null){
                response.put("success",true);
                response.put("message","Login Successfull");
                response.put("email", dbuser.getEmail());
                response.put("firstName", dbuser.getFirstName());
                response.put("lastName", dbuser.getLastName());
                response.put("planType", dbuser.getPlanType());
                response.put("planExpiryDate", dbuser.getPlanExpiryDate());
                response.put("phone", dbuser.getPhone());
                return ResponseEntity.ok(response);
            }
            else{
                response.put("success",false);
                response.put("messsage","Invalid email or password");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }


        }


    }


