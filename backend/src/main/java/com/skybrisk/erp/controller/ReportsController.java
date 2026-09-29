
        package com.skybrisk.erp.controller;

import com.skybrisk.erp.service.ReportsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin
public class ReportsController {

    private final ReportsService reportsService;

    public ReportsController(
            ReportsService reportsService
    ) {
        this.reportsService = reportsService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getReportSummary(
            @RequestParam LocalDate from,
            @RequestParam LocalDate to
    ) {

        return ResponseEntity.ok(
                reportsService.getReportSummary(from, to)
        );
    }
}

