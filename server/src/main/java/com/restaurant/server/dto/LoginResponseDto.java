package com.restaurant.server.dto;

public record LoginResponseDto(
        String token,
        String username,
        String role
) {}