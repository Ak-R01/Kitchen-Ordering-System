package com.restaurant.server.controller;

import com.restaurant.server.dto.ChangePasswordRequestDto;
import com.restaurant.server.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Deliberately NOT under /api/admin/** - that path requires the ADMIN role,
// but kitchen staff also need to be able to change their own password.
// This just requires being logged in at all (any authenticated staff member),
// which SecurityConfig's anyRequest().authenticated() already covers.
@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final StaffService staffService;

    @PatchMapping("/password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequestDto request,
            Authentication authentication) {

        // The JWT filter sets the authenticated principal's name to the username -
        // this is how we know WHO is changing their password without trusting a
        // username in the request body (can't change someone else's password this way).
        String username = authentication.getName();

        staffService.changePassword(username, request.currentPassword(), request.newPassword());
        return ResponseEntity.noContent().build();
    }
}