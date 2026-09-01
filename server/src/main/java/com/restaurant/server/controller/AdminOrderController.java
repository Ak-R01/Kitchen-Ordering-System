package com.restaurant.server.controller;

import com.restaurant.server.dto.OrderResponseDto;
import com.restaurant.server.dto.PageResponseDto;
import com.restaurant.server.entity.OrderStatus;
import com.restaurant.server.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Admin only (enforced by SecurityConfig's /api/admin/** rule) - this is a
// separate controller from OrderController because that one is mapped at
// /api/orders (used by the KDS, public + kitchen-role protected), while order
// HISTORY is an admin-dashboard concern living under /api/admin/**.
@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
public class AdminOrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<PageResponseDto<OrderResponseDto>> getOrderHistory(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(orderService.getOrderHistory(status, page, size));
    }
}