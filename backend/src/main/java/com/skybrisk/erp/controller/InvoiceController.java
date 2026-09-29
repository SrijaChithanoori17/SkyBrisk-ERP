 package com.skybrisk.erp.controller;

import com.skybrisk.erp.entity.Invoice;
import com.skybrisk.erp.service.InvoiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.skybrisk.erp.service.InvoicePdfService;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin
public class InvoiceController {

    private final InvoiceService invoiceService;

    private final InvoicePdfService invoicePdfService;

    public InvoiceController(InvoiceService invoiceService,
                             InvoicePdfService invoicePdfService) {
        this.invoiceService = invoiceService;
        this.invoicePdfService = invoicePdfService;
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoiceById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                invoiceService.getInvoiceById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(
            @RequestParam Long salesOrderId,
            @RequestParam(required = false, defaultValue = "0") Double tax) {

        return ResponseEntity.ok(
                invoiceService.createInvoice(
                        salesOrderId,
                        tax
                )
        );
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Invoice> updateStatus(
            @PathVariable Long id,
            @RequestParam Invoice.Status status) {

        return ResponseEntity.ok(
                invoiceService.updateStatus(
                        id,
                        status
                )
        );
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> generateInvoicePdf(
            @PathVariable Long id) {

        Invoice invoice =
                invoiceService.getInvoiceById(id);

        byte[] pdf =
                invoicePdfService.generateInvoicePdf(invoice);

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=invoice-" + id + ".pdf"
                )
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}

