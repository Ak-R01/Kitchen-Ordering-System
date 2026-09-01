package com.restaurant.server.dto;

public record TableAdminResponseDto(
        Long id,
        String tableNumber,
        String publicToken
) {}