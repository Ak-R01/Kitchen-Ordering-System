package com.restaurant.server.controller;

import com.restaurant.server.dto.LoginRequestDto;
import com.restaurant.server.dto.LoginResponseDto;
import com.restaurant.server.entity.Staff;
import com.restaurant.server.security.JwtService;
import com.restaurant.server.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AuthController {

    private final StaffService staffService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        Staff staff = staffService.authenticate(request.username(), request.password());
        String token = jwtService.generateToken(staff.getUsername(), staff.getRole().name());

        return ResponseEntity.ok(
                new LoginResponseDto(token, staff.getUsername(), staff.getRole().name())
        );
    }
}