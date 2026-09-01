package com.restaurant.server.repository;

import com.restaurant.server.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // Rarely needed directly since items are usually accessed via Order.getItems(),
    // but useful for reporting (e.g. "how many of item X were ordered today")
    List<OrderItem> findByOrderId(Long orderId);

    List<OrderItem> findByMenuItemId(Long menuItemId);

    boolean existsByMenuItemId(Long menuItemId);
}