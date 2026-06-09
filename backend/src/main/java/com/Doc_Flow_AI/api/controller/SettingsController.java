package com.Doc_Flow_AI.api.controller;

import com.Doc_Flow_AI.api.model.ActivityLog;
import com.Doc_Flow_AI.api.model.User;
import com.Doc_Flow_AI.api.service.ActivityLogService;
import com.Doc_Flow_AI.api.service.UserService;
import com.Doc_Flow_AI.api.service.WorkspaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SettingsController {

    @Autowired
    private UserService userService;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private WorkspaceService workspaceService;

    // GET /api/settings/profile — Get current user's profile (enhanced)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        String email = authentication.getName();
        Optional<User> optUser = userService.findByEmail(email);

        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = optUser.get();
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("provider", user.getProvider());
        profile.put("profilePicture", user.getProfilePicture());
        profile.put("createdAt", user.getCreatedAt());

        // Include activity counts
        Map<String, Long> activityCounts = activityLogService.getActivityCounts(email);
        profile.put("activityCounts", activityCounts);

        // Include workspace stats
        var workspace = workspaceService.getOrCreateWorkspace(email);
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDocuments", workspace.getDocsProcessed());
        stats.put("totalQuizzes", workspace.getQuizzesGenerated());
        stats.put("totalSummaries", workspace.getSummariesCreated());
        profile.put("workspaceStats", stats);

        return ResponseEntity.ok(profile);
    }

    // PUT /api/settings/profile — Update user profile (name + profilePicture)
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestBody Map<String, String> body) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        String email = authentication.getName();
        Optional<User> optUser = userService.findByEmail(email);

        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = optUser.get();
        String newName = body.get("name");
        String newProfilePicture = body.get("profilePicture");

        if (newName != null && !newName.isBlank()) {
            user.setName(newName);
        }
        if (newProfilePicture != null) {
            user.setProfilePicture(newProfilePicture);
        }

        userService.updateUser(java.util.Objects.requireNonNull(user));

        return ResponseEntity.ok(Map.of(
                "message", "Profile updated successfully",
                "name", user.getName(),
                "email", user.getEmail()
        ));
    }

    // GET /api/settings/activity — Get user's activity log
    @GetMapping("/activity")
    public ResponseEntity<?> getActivity(
            Authentication authentication,
            @RequestParam(defaultValue = "20") int limit) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        String email = authentication.getName();
        List<ActivityLog> activities = activityLogService.getRecentActivities(email, limit);

        return ResponseEntity.ok(activities);
    }

    // PUT /api/settings/password — Change password
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @RequestBody Map<String, String> body) {

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        String email = authentication.getName();
        Optional<User> optUser = userService.findByEmail(email);

        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = optUser.get();

        // Google users cannot change password
        if (!"local".equals(user.getProvider())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Password change is not available for Google accounts."));
        }

        String currentPassword = body.get("currentPassword");
        String newPassword = body.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Current password and new password are required."));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "New password must be at least 6 characters."));
        }

        if (!userService.verifyPassword(user, currentPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Current password is incorrect."));
        }

        userService.updatePassword(java.util.Objects.requireNonNull(user), newPassword);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    // DELETE /api/settings/account — Delete user account
    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Not authenticated"));
        }

        String email = authentication.getName();
        Optional<User> optUser = userService.findByEmail(email);

        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        userService.deleteUser(java.util.Objects.requireNonNull(optUser.get()));

        return ResponseEntity.ok(Map.of("message", "Account deleted successfully."));
    }
}
