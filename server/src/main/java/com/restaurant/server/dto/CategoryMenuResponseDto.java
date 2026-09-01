package com.restaurant.server.dto;

import java.util.List;

public record CategoryMenuResponseDto(
        String categoryName,
        List<MenuItemResponseDto> items
) {}