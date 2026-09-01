package com.restaurant.server.controller;

import com.restaurant.server.dto.OrderRequestDto;
import com.restaurant.server.dto.OrderResponseDto;
import com.restaurant.server.dto.OrderStatusUpdateRequestDto;
import com.restaurant.server.entity.OrderStatus;
import com.restaurant.server.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Public — customer app submits the cart here. No auth: the table token is the
    // only credential, checked inside OrderService.
    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(@Valid @RequestBody OrderRequestDto request) {
        OrderResponseDto order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    // Kitchen/admin — used by the KDS on load and reconnect to fetch orders it may
    // have missed while the WebSocket was disconnected.
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrdersByStatus(
            @RequestParam OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStatus(status));
    }

    // Kitchen/admin — advance an order through PLACED -> PREPARING -> READY -> SERVED
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponseDto> updateStatus(
            @PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequestDto request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.status()));
    }
}