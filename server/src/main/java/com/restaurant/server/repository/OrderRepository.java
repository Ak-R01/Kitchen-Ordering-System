package com.restaurant.server.repository;

import com.restaurant.server.entity.Order;
import com.restaurant.server.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // Used by the KDS on load/reconnect: GET /api/orders?status=PLACED
    List<Order> findByStatusOrderByCreatedAtAsc(OrderStatus status);

    // Multiple statuses at once, e.g. PLACED + PREPARING for an "active orders" view
    List<Order> findByStatusInOrderByCreatedAtAsc(List<OrderStatus> statuses);

    List<Order> findByTableIdOrderByCreatedAtDesc(Long tableId);

    // Used by GET /api/admin/orders - order history, optionally filtered by status.
    // findAll(Pageable) (inherited from JpaRepository) covers the "no filter" case.
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);
}