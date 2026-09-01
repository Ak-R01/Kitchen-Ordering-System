package com.restaurant.server.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    @JsonIgnore // parent already holds this item in its list; avoid circular JSON
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    private MenuItem menuItem;

    @Column(nullable = false)
    private Integer quantity;

    @Column(length = 500)
    private String notes;

    // Snapshots of the menu item's name and price AT THE TIME the order was placed.
    // Historical orders must never change just because someone edits the menu later -
    // these are set once in OrderService.createOrder() and never touched again.
    @Column(name = "item_name_at_order_time", nullable = false)
    private String itemNameAtOrderTime;

    @Column(name = "unit_price_at_order_time", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPriceAtOrderTime;
}