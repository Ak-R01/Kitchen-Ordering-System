package com.restaurant.server.dto;

import java.math.BigDecimal;

public record MenuItemAdminResponseDto(
        Long id,
        String name,
        BigDecimal price,
        String description,
        String imageUrl,
        Boolean available,
        Long categoryId,
        String categoryName
) {}