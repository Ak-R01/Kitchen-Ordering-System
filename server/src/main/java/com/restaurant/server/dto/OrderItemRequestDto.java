package com.restaurant.server.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequestDto(
        @NotNull Long menuItemId,
        @NotNull @Min(1) Integer quantity,
        String notes
) {}