package com.restaurant.server.service;

import com.restaurant.server.dto.StaffResponseDto;
import com.restaurant.server.entity.Staff;
import com.restaurant.server.entity.StaffRole;
import com.restaurant.server.exception.ResourceNotFoundException;
import com.restaurant.server.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder; // BCrypt bean, defined in SecurityConfig

    /**
     * Admin action: create a staff account. The raw password is hashed here —
     * it is never stored or logged in plain text.
     */
    public Staff createStaff(String name, String username, String rawPassword, StaffRole role) {
        if (staffRepository.existsByUsername(username)) {
            throw new IllegalStateException("Username already taken: " + username);
        }

        Staff staff = Staff.builder()
                .name(name)
                .username(username)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(role)
                .build();

        return staffRepository.save(staff);
    }

    /**
     * Used by GET /api/admin/staff — list every staff account for the admin dashboard.
     * Never includes the password hash.
     */
    public List<StaffResponseDto> getAllStaff() {
        return staffRepository.findAll().stream()
                .map(s -> new StaffResponseDto(s.getId(), s.getName(), s.getUsername(), s.getRole()))
                .toList();
    }

    /**
     * Admin action: remove a staff account (e.g. someone left the team).
     */
    public void deleteStaff(Long id) {
        if (!staffRepository.existsById(id)) {
            throw new ResourceNotFoundException("Staff not found: " + id);
        }
        staffRepository.deleteById(id);
    }

    /**
     * Used by the login flow to verify credentials before issuing a JWT.
     * Returns the Staff entity if the username/password combination is valid.
     */
    public Staff authenticate(String username, String rawPassword) {
        Staff staff = staffRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid username or password"));

        if (!passwordEncoder.matches(rawPassword, staff.getPasswordHash())) {
            throw new ResourceNotFoundException("Invalid username or password");
        }

        return staff;
    }

    public Staff findByUsername(String username) {
        return staffRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Staff not found: " + username));
    }

    /**
     * Self-service: a logged-in staff member changes their own password.
     * Requires the current password to be correct first - this is not an
     * admin override, it's the account owner proving they still know it.
     */
    public void changePassword(String username, String currentPassword, String newPassword) {
        Staff staff = findByUsername(username);

        if (!passwordEncoder.matches(currentPassword, staff.getPasswordHash())) {
            throw new IllegalStateException("Current password is incorrect");
        }

        staff.setPasswordHash(passwordEncoder.encode(newPassword));
        staffRepository.save(staff);
    }
}