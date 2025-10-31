package com.warrantyvault.warranty.vault.Repository;

import com.warrantyvault.warranty.vault.Entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);
}
