package com.restaurant.server.service;

import com.restaurant.server.dto.CategoryMenuResponseDto;
import com.restaurant.server.dto.CategoryResponseDto;
import com.restaurant.server.dto.MenuItemAdminResponseDto;
import com.restaurant.server.dto.MenuItemResponseDto;
import com.restaurant.server.entity.Category;
import com.restaurant.server.entity.MenuItem;
import com.restaurant.server.exception.ResourceNotFoundException;
import com.restaurant.server.repository.CategoryRepository;
import com.restaurant.server.repository.MenuItemRepository;
import com.restaurant.server.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final CategoryRepository categoryRepository;
    private final OrderItemRepository orderItemRepository;

    /**
     * Used by GET /api/menu — items grouped by category, only available ones shown.
     * @Transactional so accessing the lazy Category on each item is safe here.
     */
    @Transactional(readOnly = true)
    public List<CategoryMenuResponseDto> getMenuGroupedByCategory() {
        List<MenuItem> availableItems = menuItemRepository.findByAvailableTrue();

        return availableItems.stream()
                .collect(Collectors.groupingBy(item -> item.getCategory().getName()))
                .entrySet().stream()
                .map(entry -> new CategoryMenuResponseDto(
                        entry.getKey(),
                        entry.getValue().stream()
                                .map(item -> new MenuItemResponseDto(
                                        item.getId(),
                                        item.getName(),
                                        item.getPrice(),
                                        item.getDescription(),
                                        item.getImageUrl()
                                ))
                                .toList()
                ))
                .toList();
    }

    // ----- Admin operations below -----

    /**
     * Used by GET /api/admin/categories — full list for the admin dashboard.
     */
    public List<CategoryResponseDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryResponseDto(c.getId(), c.getName()))
                .toList();
    }

    /**
     * Used by GET /api/admin/menu-items — unlike the public menu, this shows
     * ALL items (including unavailable ones) so admins can toggle them back on.
     */
    @Transactional(readOnly = true)
    public List<MenuItemAdminResponseDto> getAllMenuItemsForAdmin() {
        return menuItemRepository.findAll().stream()
                .map(item -> new MenuItemAdminResponseDto(
                        item.getId(),
                        item.getName(),
                        item.getPrice(),
                        item.getDescription(),
                        item.getImageUrl(),
                        item.getAvailable(),
                        item.getCategory().getId(),
                        item.getCategory().getName()
                ))
                .toList();
    }

    public Category createCategory(String name) {
        Category category = Category.builder().name(name).build();
        return categoryRepository.save(category);
    }

    public MenuItem createMenuItem(Long categoryId, MenuItem menuItem) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
        menuItem.setCategory(category);
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long menuItemId, MenuItem updates) {
        MenuItem existing = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + menuItemId));

        existing.setName(updates.getName());
        existing.setPrice(updates.getPrice());
        existing.setDescription(updates.getDescription());
        existing.setImageUrl(updates.getImageUrl());
        existing.setAvailable(updates.getAvailable());

        return menuItemRepository.save(existing);
    }

    public void setAvailability(Long menuItemId, boolean available) {
        MenuItem item = menuItemRepository.findById(menuItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found: " + menuItemId));
        item.setAvailable(available);
        menuItemRepository.save(item);
    }

    public void deleteMenuItem(Long menuItemId) {
        if (!menuItemRepository.existsById(menuItemId)) {
            throw new ResourceNotFoundException("Menu item not found: " + menuItemId);
        }
        if (orderItemRepository.existsByMenuItemId(menuItemId)) {
            throw new IllegalStateException(
                    "This item has existing orders and can't be deleted - mark it unavailable instead to hide it from the menu.");
        }
        menuItemRepository.deleteById(menuItemId);
    }
}