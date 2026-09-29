package com.skybrisk.erp.service;

import com.skybrisk.erp.entity.User;

public interface AuthService {

    User register(User user);

    String login(String email, String password);
}