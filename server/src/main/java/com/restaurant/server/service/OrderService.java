package com.restaurant.server.service;

import com.restaurant.server.dto.*;
import com.restaurant.server.entity.*;
import com.restaurant.server.exception.ResourceNotFoundException;
import com.restaurant.server.repository.MenuItemRepository;
import com.restaurant.server.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final String KITCHEN_TOPIC = "/topic/kitchen";

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final TableService tableService;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Creates a new order from a customer's cart, persists it, then pushes it
     * to every connected kitchen display over the /topic/kitchen WebSocket topic.
     */
    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto request) {
        RestaurantTable table = tableService.resolveToken(request.tableToken());

        Order order = Order.builder()
                .table(table)
                .status(OrderStatus.PLACED)
                .build();

        for (OrderItemRequestDto itemRequest : request.items()) {
            MenuItem menuItem = menuItemRepository.findById(itemRequest.menuItemId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Menu item not found: " + itemRequest.menuItemId()));

            if (!Boolean.TRUE.equals(menuItem.getAvailable())) {
                throw new IllegalStateException(
                        "Menu item is currently unavailable: " + menuItem.getName());
            }

            OrderItem orderItem = OrderItem.builder()
                    .menuItem(menuItem)
                    .quantity(itemRequest.quantity())
                    .notes(itemRequest.notes())
                    // Snapshot NOW - if the price changes tomorrow, this order still
                    // shows what the customer was actually charged today.
                    .itemNameAtOrderTime(menuItem.getName())
                    .unitPriceAtOrderTime(menuItem.getPrice())
                    .build();

            order.addItem(orderItem); // keeps both sides of the relationship in sync
        }

        Order saved = orderRepository.save(order);
        OrderResponseDto response = toResponseDto(saved);

        // Fire-and-forget push to every connected kitchen display
        messagingTemplate.convertAndSend(KITCHEN_TOPIC, response);

        return response;
    }

    /**
     * Used by the KDS on initial load / reconnect to fetch orders it may have missed
     * while disconnected. WebSocket only delivers messages sent while connected.
     */
    public List<OrderResponseDto> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatusOrderByCreatedAtAsc(status)
                .stream()
                .map(this::toResponseDto)
                .toList();
    }

    /**
     * Kitchen staff action: PLACED -> PREPARING -> READY -> SERVED.
     * Also re-broadcasts the update so any customer-facing status screen (future feature)
     * stays in sync, and so multiple kitchen screens agree on current state.
     */
    @Transactional
    public OrderResponseDto updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));

        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);
        OrderResponseDto response = toResponseDto(saved);

        messagingTemplate.convertAndSend(KITCHEN_TOPIC, response);

        return response;
    }

    /**
     * Used by GET /api/admin/orders - full order history for the admin dashboard,
     * newest first. Pass status=null to see every order regardless of status.
     */
    @Transactional(readOnly = true)
    public PageResponseDto<OrderResponseDto> getOrderHistory(OrderStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Order> result = (status != null)
                ? orderRepository.findByStatus(status, pageable)
                : orderRepository.findAll(pageable);

        return new PageResponseDto<>(
                result.getContent().stream().map(this::toResponseDto).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }

    private OrderResponseDto toResponseDto(Order order) {
        List<OrderItemResponseDto> items = order.getItems().stream()
                .map(item -> new OrderItemResponseDto(
                        item.getMenuItem().getId(),
                        item.getItemNameAtOrderTime(),   // not item.getMenuItem().getName()
                        item.getQuantity(),
                        item.getNotes(),
                        item.getUnitPriceAtOrderTime()   // not item.getMenuItem().getPrice()
                ))
                .toList();

        return new OrderResponseDto(
                order.getId(),
                order.getTable().getTableNumber(),
                order.getStatus(),
                order.getCreatedAt(),
                items
        );
    }
}