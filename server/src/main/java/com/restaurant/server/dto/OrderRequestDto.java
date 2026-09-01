package com.restaurant.server.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequestDto(
        @NotBlank String tableToken,
        @NotEmpty @Valid List<OrderItemRequestDto> items
) {}