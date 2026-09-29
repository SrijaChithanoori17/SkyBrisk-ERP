
        package com.skybrisk.erp.service;

import com.skybrisk.erp.entity.Invoice;

import java.util.List;

public interface InvoiceService {

    List<Invoice> getAllInvoices();

    Invoice getInvoiceById(Long id);

    Invoice createInvoice(Long salesOrderId, Double tax);

    Invoice updateStatus(Long id, Invoice.Status status);
}

