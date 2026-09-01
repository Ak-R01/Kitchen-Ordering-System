package com.restaurant.server.dto;

import com.restaurant.server.entity.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDto(
        Long id,
        String tableNumber,
        OrderStatus status,
        LocalDateTime createdAt,
        List<OrderItemResponseDto> items
) {}