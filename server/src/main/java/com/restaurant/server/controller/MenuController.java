package com.restaurant.server.controller;

import com.restaurant.server.dto.CategoryMenuResponseDto;
import com.restaurant.server.dto.CreateCategoryRequestDto;
import com.restaurant.server.dto.MenuItemRequestDto;
import com.restaurant.server.entity.Category;
import com.restaurant.server.entity.MenuItem;
import com.restaurant.server.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // Public — customer app's main menu screen
    @GetMapping("/api/menu")
    public ResponseEntity<List<CategoryMenuResponseDto>> getMenu() {
        return ResponseEntity.ok(menuService.getMenuGroupedByCategory());
    }

    // ----- Admin endpoints below -----

    @GetMapping("/api/admin/categories")
    public ResponseEntity<List<com.restaurant.server.dto.CategoryResponseDto>> getAllCategories() {
        return ResponseEntity.ok(menuService.getAllCategories());
    }

    @GetMapping("/api/admin/menu-items")
    public ResponseEntity<List<com.restaurant.server.dto.MenuItemAdminResponseDto>> getAllMenuItems() {
        return ResponseEntity.ok(menuService.getAllMenuItemsForAdmin());
    }

    @PostMapping("/api/admin/categories")
    public ResponseEntity<Category> createCategory(@Valid @RequestBody CreateCategoryRequestDto request) {
        Category category = menuService.createCategory(request.name());
        return ResponseEntity.status(HttpStatus.CREATED).body(category);
    }

    @PostMapping("/api/admin/categories/{categoryId}/menu-items")
    public ResponseEntity<MenuItem> createMenuItem(
            @PathVariable Long categoryId,
            @Valid @RequestBody MenuItemRequestDto request) {

        MenuItem menuItem = MenuItem.builder()
                .name(request.name())
                .price(request.price())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .available(request.available() == null ? true : request.available())
                .build();

        MenuItem created = menuService.createMenuItem(categoryId, menuItem);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/api/admin/menu-items/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(
            @PathVariable Long id,
            @Valid @RequestBody MenuItemRequestDto request) {

        MenuItem updates = MenuItem.builder()
                .name(request.name())
                .price(request.price())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .available(request.available() == null ? true : request.available())
                .build();

        return ResponseEntity.ok(menuService.updateMenuItem(id, updates));
    }

    @PatchMapping("/api/admin/menu-items/{id}/availability")
    public ResponseEntity<Void> setAvailability(
            @PathVariable Long id, @RequestParam boolean available) {
        menuService.setAvailability(id, available);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/api/admin/menu-items/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}