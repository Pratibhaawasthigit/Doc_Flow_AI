package com.Doc_Flow_AI.api.service;

import com.Doc_Flow_AI.api.model.User;
import com.Doc_Flow_AI.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import org.springframework.lang.NonNull;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User saveUser(@NonNull User user) {
        if (user.getPassword() != null && "local".equals(user.getProvider())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean verifyPassword(User user, String password) {
        return passwordEncoder.matches(password, user.getPassword());
    }

    public User updateUser(@NonNull User user) {
        return userRepository.save(user);
    }

    public void updatePassword(@NonNull User user, String newPassword) {
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void deleteUser(@NonNull User user) {
        userRepository.delete(user);
    }

    public User processOAuthPostLogin(String email, String name, String provider, String providerId) {
        Optional<User> existUser = userRepository.findByEmail(email);
        
        if (existUser.isPresent()) {
            User user = existUser.get();
            if (user.getProviderId() == null) {
                user.setProviderId(providerId);
                user.setProvider(provider);
                return userRepository.save(user);
            }
            return user;
        } else {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setProvider(provider);
            newUser.setProviderId(providerId);
            return userRepository.save(newUser);
        }
    }
}
