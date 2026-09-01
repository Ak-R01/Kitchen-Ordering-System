package com.restaurant.server.repository;

import com.restaurant.server.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {

    // Used by GET /api/menu — customers should only see items marked available
    List<MenuItem> findByAvailableTrue();

    List<MenuItem> findByCategoryId(Long categoryId);

    List<MenuItem> findByCategoryIdAndAvailableTrue(Long categoryId);
}