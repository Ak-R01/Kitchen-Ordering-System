package com.restaurant.server.controller;

import com.restaurant.server.dto.CreateTableRequestDto;
import com.restaurant.server.dto.TableAdminResponseDto;
import com.restaurant.server.dto.TableInfoResponseDto;
import com.restaurant.server.entity.RestaurantTable;
import com.restaurant.server.service.TableService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    // Public — called by the customer app right after a QR scan
    @GetMapping("/api/tables/by-token/{token}")
    public ResponseEntity<TableInfoResponseDto> getTableByToken(@PathVariable String token) {
        return ResponseEntity.ok(tableService.getTableInfoByToken(token));
    }

    // Admin — list every table, including tokens, for the management dashboard
    @GetMapping("/api/admin/tables")
    public ResponseEntity<List<TableAdminResponseDto>> getAllTables() {
        List<TableAdminResponseDto> tables = tableService.getAllTables().stream()
                .map(this::toAdminDto)
                .toList();
        return ResponseEntity.ok(tables);
    }

    // Admin — create a new table, returns the token so a QR code can be generated for it
    @PostMapping("/api/admin/tables")
    public ResponseEntity<TableAdminResponseDto> createTable(
            @Valid @RequestBody CreateTableRequestDto request) {

        RestaurantTable table = tableService.createTable(request.tableNumber());
        return ResponseEntity.status(HttpStatus.CREATED).body(toAdminDto(table));
    }

    // Admin — remove a table
    @DeleteMapping("/api/admin/tables/{id}")
    public ResponseEntity<Void> deleteTable(@PathVariable Long id) {
        tableService.deleteTable(id);
        return ResponseEntity.noContent().build();
    }

    // Admin — invalidate a table's current QR code and issue a new one
    @PostMapping("/api/admin/tables/{id}/rotate-token")
    public ResponseEntity<TableAdminResponseDto> rotateToken(@PathVariable Long id) {
        RestaurantTable table = tableService.rotateToken(id);
        return ResponseEntity.ok(toAdminDto(table));
    }

    private TableAdminResponseDto toAdminDto(RestaurantTable table) {
        return new TableAdminResponseDto(table.getId(), table.getTableNumber(), table.getPublicToken());
    }
}