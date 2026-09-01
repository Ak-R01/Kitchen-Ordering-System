package com.restaurant.server.repository;

import com.restaurant.server.entity.RestaurantTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RestaurantTableRepository extends JpaRepository<RestaurantTable, Long> {

    // Used by GET /api/tables/by-token/{token} to resolve a QR scan to a table
    Optional<RestaurantTable> findByPublicToken(String publicToken);

    Optional<RestaurantTable> findByTableNumber(String tableNumber);

    boolean existsByPublicToken(String publicToken);
}