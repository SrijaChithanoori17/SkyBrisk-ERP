
        package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.Invoice;
import com.skybrisk.erp.entity.InvoiceItem;
import com.skybrisk.erp.entity.Product;
import com.skybrisk.erp.entity.SalesOrder;
import com.skybrisk.erp.repository.InvoiceRepository;
import com.skybrisk.erp.repository.ProductRepository;
import com.skybrisk.erp.repository.SalesOrderRepository;
import com.skybrisk.erp.service.InvoiceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final ProductRepository productRepository;

    public InvoiceServiceImpl(
            InvoiceRepository invoiceRepository,
            SalesOrderRepository salesOrderRepository,
            ProductRepository productRepository) {

        this.invoiceRepository = invoiceRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    @Override
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Invoice not found"));
    }

    @Override
    @Transactional
    public Invoice createInvoice(
            Long salesOrderId,
            Double tax) {

        // Validate Sales Order ID
        if (salesOrderId == null) {
            throw new RuntimeException(
                    "Sales Order ID is required");
        }

        // Find Sales Order
        SalesOrder salesOrder = salesOrderRepository
                .findById(salesOrderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Sales order not found"));

        // Invoice can only be created for APPROVED orders
        if (salesOrder.getStatus() != SalesOrder.Status.APPROVED) {
            throw new RuntimeException(
                    "Invoice can only be generated for an approved sales order");
        }

        // Prevent duplicate invoice
        if (invoiceRepository
                .findAll()
                .stream()
                .anyMatch(invoice ->
                        invoice.getSalesOrder() != null &&
                                invoice.getSalesOrder()
                                        .getId()
                                        .equals(salesOrderId))) {

            throw new RuntimeException(
                    "Invoice already exists for this sales order");
        }

        // Validate Sales Order items
        if (salesOrder.getItems() == null ||
                salesOrder.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Sales order has no items");
        }

        // Validate tax
        if (tax == null) {
            tax = 0.0;
        }

        if (tax < 0) {
            throw new RuntimeException(
                    "Tax cannot be negative");
        }

        // Create Invoice
        Invoice invoice = new Invoice();

        invoice.setCustomer(
                salesOrder.getCustomer()
        );

        invoice.setSalesOrder(
                salesOrder
        );

        invoice.setInvoiceDate(
                LocalDate.now()
        );

        invoice.setTax(tax);

        // New invoices are unpaid
        invoice.setStatus(
                Invoice.Status.UNPAID
        );

        double subtotal = 0.0;

        // Create Invoice Items
        for (var salesItem : salesOrder.getItems()) {

            if (salesItem.getProduct() == null ||
                    salesItem.getProduct().getId() == null) {

                throw new RuntimeException(
                        "Product is required for invoice item");
            }

            if (salesItem.getQuantity() == null ||
                    salesItem.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Invoice quantity must be greater than 0");
            }

            Product product = productRepository
                    .findById(
                            salesItem.getProduct().getId()
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Product not found"));

            if (product.getUnitPrice() == null) {
                throw new RuntimeException(
                        "Product price is not available");
            }

            InvoiceItem invoiceItem =
                    new InvoiceItem();

            invoiceItem.setInvoice(invoice);

            invoiceItem.setProduct(product);

            invoiceItem.setQuantity(
                    salesItem.getQuantity()
            );

            invoiceItem.setUnitPrice(
                    product.getUnitPrice()
            );

            double itemTotal =
                    product.getUnitPrice()
                            * salesItem.getQuantity();

            invoiceItem.setTotalPrice(
                    itemTotal
            );

            invoice.getItems().add(
                    invoiceItem
            );

            subtotal += itemTotal;
        }

        // Calculate tax amount
        double taxAmount =
                subtotal * tax / 100;

        // Calculate final payable amount
        double totalPayable =
                subtotal + taxAmount;

        invoice.setTotalPayable(
                totalPayable
        );

        // Save Invoice
        return invoiceRepository.save(invoice);
    }

    @Override
    public Invoice updateStatus(
            Long id,
            Invoice.Status status) {

        if (status == null) {
            throw new RuntimeException(
                    "Invoice status is required");
        }

        Invoice invoice =
                getInvoiceById(id);

        invoice.setStatus(status);

        return invoiceRepository.save(invoice);
    }
}

