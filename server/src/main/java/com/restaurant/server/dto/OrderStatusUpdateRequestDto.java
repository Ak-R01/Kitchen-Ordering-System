package com.restaurant.server.dto;

import com.restaurant.server.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequestDto(
        @NotNull OrderStatus status
) {}