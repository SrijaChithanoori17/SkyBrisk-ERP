
        package com.skybrisk.erp.controller;

import com.skybrisk.erp.entity.PurchaseOrder;
import com.skybrisk.erp.service.PurchaseOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(
            PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    // Get all Purchase Orders
    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllPurchaseOrders() {

        return ResponseEntity.ok(
                purchaseOrderService.getAllPurchaseOrders()
        );
    }

    // Get Purchase Orders specifically for GRN
    @GetMapping("/for-grn")
    public ResponseEntity<List<PurchaseOrder>> getPurchaseOrdersForGRN() {

        return ResponseEntity.ok(
                purchaseOrderService.getAllPurchaseOrders()
        );
    }

    // Get Purchase Order by ID
    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getPurchaseOrderById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                purchaseOrderService.getPurchaseOrderById(id)
        );
    }

    // Create Purchase Order
    @PostMapping
    public ResponseEntity<PurchaseOrder> createPurchaseOrder(
            @RequestBody PurchaseOrder purchaseOrder) {

        return ResponseEntity.ok(
                purchaseOrderService.createPurchaseOrder(
                        purchaseOrder
                )
        );
    }

    // Update Purchase Order
    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrder(
            @PathVariable Long id,
            @RequestBody PurchaseOrder purchaseOrder) {

        return ResponseEntity.ok(
                purchaseOrderService.updatePurchaseOrder(
                        id,
                        purchaseOrder
                )
        );
    }

    // Update Purchase Order status
    @PutMapping("/{id}/status")
    public ResponseEntity<PurchaseOrder> updatePurchaseOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        return ResponseEntity.ok(
                purchaseOrderService.updatePurchaseOrderStatus(
                        id,
                        status
                )
        );
    }

    // Delete Purchase Order
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePurchaseOrder(
            @PathVariable Long id) {

        purchaseOrderService.deletePurchaseOrder(id);

        return ResponseEntity.noContent().build();
    }
}

