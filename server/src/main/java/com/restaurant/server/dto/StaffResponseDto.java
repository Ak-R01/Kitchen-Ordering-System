package com.restaurant.server.dto;

import com.restaurant.server.entity.StaffRole;

public record StaffResponseDto(
        Long id,
        String name,
        String username,
        StaffRole role
) {}