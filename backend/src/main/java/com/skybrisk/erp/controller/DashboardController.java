package com.skybrisk.erp.controller;

import com.skybrisk.erp.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService) {

        this.dashboardService = dashboardService;
    }

    @GetMapping("/sales-summary")
    public ResponseEntity<Map<String, Object>> getSalesSummary() {

        return ResponseEntity.ok(
                dashboardService.getSalesSummary()
        );
    }

    @GetMapping("/purchase-summary")
    public ResponseEntity<Map<String, Object>> getPurchaseSummary() {

        return ResponseEntity.ok(
                dashboardService.getPurchaseSummary()
        );
    }

    @GetMapping("/stock-alerts")
    public ResponseEntity<List<?>> getStockAlerts() {

        return ResponseEntity.ok(
                dashboardService.getStockAlerts()
        );
    }
}