package com.restaurant.server.controller;

import com.restaurant.server.dto.CreateStaffRequestDto;
import com.restaurant.server.dto.StaffResponseDto;
import com.restaurant.server.entity.Staff;
import com.restaurant.server.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    // Admin only (enforced by SecurityConfig's /api/admin/** rule)
    @GetMapping
    public ResponseEntity<List<StaffResponseDto>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @PostMapping
    public ResponseEntity<StaffResponseDto> createStaff(@Valid @RequestBody CreateStaffRequestDto request) {
        Staff staff = staffService.createStaff(
                request.name(), request.username(), request.password(), request.role());

        StaffResponseDto response = new StaffResponseDto(
                staff.getId(), staff.getName(), staff.getUsername(), staff.getRole());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}