package com.restaurant.server.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateTableRequestDto(
        @NotBlank String tableNumber
) {}