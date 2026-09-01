package com.restaurant.server.service;

import com.restaurant.server.dto.TableInfoResponseDto;
import com.restaurant.server.entity.RestaurantTable;
import com.restaurant.server.exception.ResourceNotFoundException;
import com.restaurant.server.repository.RestaurantTableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TableService {

    private final RestaurantTableRepository tableRepository;

    /**
     * Resolves a QR-code token to the actual table entity.
     * Used internally by OrderService — never expose the returned entity directly.
     */
    public RestaurantTable resolveToken(String token) {
        return tableRepository.findByPublicToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("No table found for the given token"));
    }

    /**
     * Public-facing lookup for GET /api/tables/by-token/{token}.
     * Returns only what the customer app needs to display (e.g. "Table 5").
     */
    public TableInfoResponseDto getTableInfoByToken(String token) {
        RestaurantTable table = resolveToken(token);
        return new TableInfoResponseDto(table.getTableNumber());
    }

    /**
     * Used by GET /api/admin/tables — full list for the admin dashboard,
     * including tokens so QR codes can be generated/regenerated client-side.
     */
    public List<RestaurantTable> getAllTables() {
        return tableRepository.findAll();
    }

    /**
     * Admin action: create a new table with a freshly generated, non-guessable token.
     */
    public RestaurantTable createTable(String tableNumber) {
        RestaurantTable table = RestaurantTable.builder()
                .tableNumber(tableNumber)
                .publicToken(generateToken())
                .build();
        return tableRepository.save(table);
    }

    /**
     * Admin action: invalidate a table's existing QR code by issuing a new token.
     * The old printed QR code stops working immediately after this.
     */
    public RestaurantTable rotateToken(Long tableId) {
        RestaurantTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new ResourceNotFoundException("Table not found: " + tableId));
        table.setPublicToken(generateToken());
        return tableRepository.save(table);
    }

    /**
     * Admin action: remove a table entirely (e.g. seating was reconfigured).
     */
    public void deleteTable(Long tableId) {
        if (!tableRepository.existsById(tableId)) {
            throw new ResourceNotFoundException("Table not found: " + tableId);
        }
        tableRepository.deleteById(tableId);
    }

    private String generateToken() {
        // UUID gives 122 bits of randomness — not practically guessable.
        // Swap for a signed JWT here later if you want expiry/rotation built into the token itself.
        return UUID.randomUUID().toString();
    }
}