package com.restaurant.server.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant_tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Human-readable, staff-facing only — never exposed to the customer app
    @Column(name = "table_number", nullable = false, unique = true)
    private String tableNumber;

    // Opaque random token encoded in the table's QR code.
    // This is what the customer app actually sends — never the numeric id.
    @Column(name = "public_token", nullable = false, unique = true, updatable = false)
    private String publicToken;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}