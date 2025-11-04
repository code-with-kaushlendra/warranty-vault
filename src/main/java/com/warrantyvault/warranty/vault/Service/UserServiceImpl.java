package com.warrantyvault.warranty.vault.Service;

import com.warrantyvault.warranty.vault.Entity.User;
import com.warrantyvault.warranty.vault.Repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String createUser(User user) {


        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return "User already exists with this email!";
        }

        User user1 = new User();
        BeanUtils.copyProperties(user, user1);
        String encryptedPassword = passwordEncoder.encode(user1.getPassword());
        user1.setPassword(encryptedPassword);

        user1.setCreatedAt(LocalDateTime.now());
        user1.setUpdatedAt(LocalDateTime.now());


        // ✅ Plan setup (default plan = Basic)
        if (user1.getPlanType() == null || user1.getPlanType().isEmpty()) {
            user1.setPlanType("Basic");
        }
        user1.setPlanStartDate(LocalDate.now());

        // ✅ Set plan expiry based on type
        switch (user1.getPlanType()){
            case "Premium":
                user1.setPlanExpiryDate(null); //lifetyme
                break;
            case "Basic":
                // Example: 1 month duration
                user1.setPlanExpiryDate(LocalDate.now().plusMonths(1));
                break;
            default:
                user1.setPlanExpiryDate(LocalDate.now().plusDays(10)); // 10-day expiry for basic plan
                break;
        }


        userRepository.save(user1);
        return " User Added Successfully";
    }

    @Override
    public User loginUser(User user) {
        Optional<User> found = userRepository.findByEmail(user.getEmail());
        if (found.isPresent()) {
            User dbuser = found.get();
            boolean passwordMatch = passwordEncoder.matches(user.getPassword(), dbuser.getPassword());

            if (passwordMatch) {
                // ✅ (Optional) Update plan status on login
                updatePlanStatusIfExpired(dbuser);
                return dbuser;
            }
        }
return  null;

    }
    private void updatePlanStatusIfExpired(User user) {
        if (user.getPlanExpiryDate() != null && user.getPlanExpiryDate().isBefore(LocalDate.now())) {
            user.setPlanType("Expired");
            userRepository.save(user);
        }
    }
}

