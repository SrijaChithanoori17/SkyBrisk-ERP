package com.skybrisk.erp.controller;

import com.skybrisk.erp.entity.SalesOrder;
import com.skybrisk.erp.service.SalesOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sales-orders")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(
            SalesOrderService salesOrderService) {

        this.salesOrderService = salesOrderService;
    }

    @GetMapping
    public ResponseEntity<List<SalesOrder>> getAllSalesOrders() {

        return ResponseEntity.ok(
                salesOrderService.getAllSalesOrders()
        );
    }


    @GetMapping("/top-selling")
    public ResponseEntity<List<Object[]>> getTopSellingProducts() {

        return ResponseEntity.ok(
                salesOrderService.getTopSellingProducts()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<SalesOrder> getSalesOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                salesOrderService.getSalesOrderById(id)
        );
    }

    @PostMapping
    public ResponseEntity<SalesOrder> createSalesOrder(
            @RequestBody SalesOrder salesOrder) {

        return ResponseEntity.ok(
                salesOrderService.createSalesOrder(
                        salesOrder
                )
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SalesOrder> updateSalesOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                salesOrderService.updateSalesOrderStatus(
                        id,
                        status
                )
        );
    }
}