package com.Doc_Flow_AI.api.controller;

import com.Doc_Flow_AI.api.model.User;
import com.Doc_Flow_AI.api.service.JwtService;
import com.Doc_Flow_AI.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    // POST /api/auth/register
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        String name = body.get("name");

        if (email == null || password == null || name == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name, email, and password are required."));
        }
        if (userService.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", "Email already registered."));
        }

        System.out.println("DEBUG: Registering new user: [" + email + "] with password length: " + password.length());

        try {
            User user = new User(email, password, name);
            userService.saveUser(user);
            
            String token = jwtService.generateToken(email);
            return ResponseEntity.ok(Map.of(
                "message", "Registration successful.",
                "token", token,
                "name", name
            ));
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Registration failed: " + e.getMessage()));
        }
    }

    // POST /api/auth/login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        
        System.out.println("DEBUG: Login attempt for email: [" + email + "]");

        if (email == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Email and password are required."));
        }

        Optional<User> optUser = userService.findByEmail(email);
        if (optUser.isEmpty()) {
            System.out.println("DEBUG: User not found in DB");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials."));
        }
        
        User user = optUser.get();
        System.out.println("DEBUG: Found user. Provider: " + user.getProvider());
        
        if (!"local".equals(user.getProvider())) {
            System.out.println("DEBUG: Non-local provider login attempted via local flow");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials."));
        }

        boolean matches = userService.verifyPassword(user, password);
        System.out.println("DEBUG: Password verification result: " + matches);

        if (!matches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials."));
        }

        String token = jwtService.generateToken(user.getEmail());
        
        return ResponseEntity.ok(Map.of(
            "token", token,
            "name", user.getName(),
            "email", user.getEmail()
        ));
    }

    // POST /api/auth/google
    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String name = body.get("name");
        String googleId = body.get("googleId");
        String picture = body.get("picture");

        if (email == null || googleId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid Google data."));
        }

        User user = userService.processOAuthPostLogin(email, name, "google", googleId);
        
        // Save Google profile picture
        if (picture != null && !picture.isBlank()) {
            user.setProfilePicture(picture);
            userService.updateUser(user);
        }

        String token = jwtService.generateToken(user.getEmail());

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("profilePicture", user.getProfilePicture());
        return ResponseEntity.ok(response);
    }
}
