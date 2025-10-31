package com.warrantyvault.warranty.vault.Service;

import com.warrantyvault.warranty.vault.Entity.User;

public interface UserService {

    public String createUser(User user);
    public User loginUser(User user);
}
