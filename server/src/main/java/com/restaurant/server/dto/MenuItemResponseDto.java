package com.restaurant.server.dto;

import java.math.BigDecimal;

public record MenuItemResponseDto(
        Long id,
        String name,
        BigDecimal price,
        String description,
        String imageUrl
) {}