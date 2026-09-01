package com.restaurant.server.config;

import com.restaurant.server.entity.StaffRole;
import com.restaurant.server.repository.StaffRepository;
import com.restaurant.server.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final StaffRepository staffRepository;
    private final StaffService staffService;

    @Override
    public void run(String... args) {
        // Only seed if no staff accounts exist yet - safe to leave this running,
        // it won't create duplicates on every restart.
        if (staffRepository.count() == 0) {
            staffService.createStaff(
                    "Admin",
                    "admin",
                    "changeme123", // CHANGE THIS - this is a dev-only default password
                    StaffRole.ADMIN
            );
            System.out.println("Seeded initial admin account -> username: admin / password: changeme123");
            System.out.println("Log in once and change this password before going anywhere near production.");
        }
    }
}