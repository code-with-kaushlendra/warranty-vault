package com.warrantyvault.warranty.vault.Service;

import com.warrantyvault.warranty.vault.Entity.User;
import com.warrantyvault.warranty.vault.Repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public String createUser(User user) {
        User user1 = new User();
        BeanUtils.copyProperties(user, user1);
        String encryptedPassword = passwordEncoder.encode(user1.getPassword());
        user1.setPassword(encryptedPassword);

        userRepository.save(user1);
        return " User Added Successfully";
    }

    @Override
    public User loginUser(User user) {
        Optional<User> found = userRepository.findByEmail(user.getEmail());
        if (found.isPresent()) {
            User dbuser = found.get();
            boolean passwordmatch = passwordEncoder.matches(user.getPassword(), dbuser.getPassword());

            if (passwordmatch) {
                return dbuser;
            }
        }
return  null;

    }
}

