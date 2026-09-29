package com.skybrisk.erp.controller;

import com.skybrisk.erp.entity.GRN;
import com.skybrisk.erp.service.GRNService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grns")
public class GRNController {

    private final GRNService grnService;

    public GRNController(GRNService grnService) {
        this.grnService = grnService;
    }

    @GetMapping
    public ResponseEntity<List<GRN>> getAllGRNs() {

        return ResponseEntity.ok(
                grnService.getAllGRNs()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<GRN> getGRNById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                grnService.getGRNById(id)
        );
    }

    @PostMapping
    public ResponseEntity<GRN> createGRN(
            @RequestBody GRN grn) {

        return ResponseEntity.ok(
                grnService.createGRN(grn)
        );
    }
}