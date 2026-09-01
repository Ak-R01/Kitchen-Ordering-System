package com.restaurant.server.dto;

import java.math.BigDecimal;

public record OrderItemResponseDto(
        Long menuItemId,
        String menuItemName,
        Integer quantity,
        String notes,
        BigDecimal unitPrice
) {}