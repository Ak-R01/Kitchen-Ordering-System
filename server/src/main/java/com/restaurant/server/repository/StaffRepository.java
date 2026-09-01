package com.restaurant.server.repository;

import com.restaurant.server.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StaffRepository extends JpaRepository<Staff, Long> {

    // Used during login: POST /api/admin/login
    Optional<Staff> findByUsername(String username);

    boolean existsByUsername(String username);
}