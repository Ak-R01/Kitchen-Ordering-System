package com.restaurant.server.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record MenuItemRequestDto(
        @NotBlank String name,
        @NotNull @Positive BigDecimal price,
        String description,
        String imageUrl,
        Boolean available
) {}