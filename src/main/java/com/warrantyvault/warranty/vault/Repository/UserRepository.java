package com.warrantyvault.warranty.vault.Repository;

import com.warrantyvault.warranty.vault.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
