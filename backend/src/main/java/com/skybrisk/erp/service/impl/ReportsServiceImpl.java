
        package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.Invoice;
import com.skybrisk.erp.entity.Product;
import com.skybrisk.erp.entity.PurchaseOrder;
import com.skybrisk.erp.entity.SalesOrder;
import com.skybrisk.erp.repository.InvoiceRepository;
import com.skybrisk.erp.repository.ProductRepository;
import com.skybrisk.erp.repository.PurchaseOrderRepository;
import com.skybrisk.erp.repository.SalesOrderRepository;
import com.skybrisk.erp.service.ReportsService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportsServiceImpl implements ReportsService {

    private final SalesOrderRepository salesOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final InvoiceRepository invoiceRepository;
    private final ProductRepository productRepository;

    public ReportsServiceImpl(
            SalesOrderRepository salesOrderRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            InvoiceRepository invoiceRepository,
            ProductRepository productRepository
    ) {
        this.salesOrderRepository = salesOrderRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.invoiceRepository = invoiceRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Map<String, Object> getReportSummary(
            LocalDate from,
            LocalDate to
    ) {

        Map<String, Object> report = new HashMap<>();

        // =========================================
        // SALES
        // =========================================

        List<SalesOrder> salesOrders =
                salesOrderRepository.findAll();

        double totalSales = 0.0;

        int salesOrderCount = 0;
        int pendingOrders = 0;
        int approvedOrders = 0;
        int dispatchedOrders = 0;

        for (SalesOrder order : salesOrders) {

            LocalDate orderDate = order.getOrderDate();

            if (orderDate == null) {
                continue;
            }

            if (!orderDate.isBefore(from)
                    && !orderDate.isAfter(to)) {

                salesOrderCount++;

                if (order.getTotalAmount() != null) {
                    totalSales += order.getTotalAmount();
                }

                if (order.getStatus()
                        == SalesOrder.Status.PENDING) {

                    pendingOrders++;
                }

                if (order.getStatus()
                        == SalesOrder.Status.APPROVED) {

                    approvedOrders++;
                }

                if (order.getStatus()
                        == SalesOrder.Status.DISPATCHED) {

                    dispatchedOrders++;
                }
            }
        }


        // =========================================
        // PURCHASES
        // =========================================

        List<PurchaseOrder> purchaseOrders =
                purchaseOrderRepository.findAll();

        double totalPurchases = 0.0;

        int purchaseOrderCount = 0;
        int orderedPurchases = 0;
        int receivedPurchases = 0;

        for (PurchaseOrder order : purchaseOrders) {

            LocalDate deliveryDate =
                    order.getExpectedDeliveryDate();

            if (deliveryDate == null) {
                continue;
            }

            if (!deliveryDate.isBefore(from)
                    && !deliveryDate.isAfter(to)) {

                purchaseOrderCount++;

                if (order.getStatus()
                        == PurchaseOrder.Status.ORDERED) {

                    orderedPurchases++;
                }

                if (order.getStatus()
                        == PurchaseOrder.Status.RECEIVED) {

                    receivedPurchases++;
                }

                if (order.getItems() != null) {

                    for (var item : order.getItems()) {

                        if (item.getProduct() != null
                                && item.getProduct().getUnitPrice() != null
                                && item.getQuantity() != null) {

                            totalPurchases +=
                                    item.getProduct().getUnitPrice()
                                            * item.getQuantity();
                        }
                    }
                }
            }
        }


        // =========================================
        // INVOICES
        // =========================================

        List<Invoice> invoices =
                invoiceRepository.findAll();

        double totalInvoiceAmount = 0.0;
        double paidAmount = 0.0;
        double unpaidAmount = 0.0;

        int paidInvoices = 0;
        int unpaidInvoices = 0;

        for (Invoice invoice : invoices) {

            LocalDate invoiceDate =
                    invoice.getInvoiceDate();

            if (invoiceDate == null) {
                continue;
            }

            if (!invoiceDate.isBefore(from)
                    && !invoiceDate.isAfter(to)) {

                double amount =
                        invoice.getTotalPayable() != null
                                ? invoice.getTotalPayable()
                                : 0.0;

                totalInvoiceAmount += amount;

                if (invoice.getStatus()
                        == Invoice.Status.PAID) {

                    paidInvoices++;
                    paidAmount += amount;
                }

                if (invoice.getStatus()
                        == Invoice.Status.UNPAID) {

                    unpaidInvoices++;
                    unpaidAmount += amount;
                }
            }
        }


        // =========================================
        // INVENTORY
        // =========================================

        List<Product> products =
                productRepository.findAll();

        int totalProducts = products.size();

        int totalStock = products.stream()
                .map(Product::getCurrentStock)
                .filter(stock -> stock != null)
                .mapToInt(Integer::intValue)
                .sum();

        int lowStockProducts = 0;
        int outOfStockProducts = 0;

        for (Product product : products) {

            Integer stock = product.getCurrentStock();
            Integer reorderLevel = product.getReorderLevel();

            if (stock == null) {
                continue;
            }

            if (stock <= 0) {

                outOfStockProducts++;

            } else if (reorderLevel != null
                    && stock <= reorderLevel) {

                lowStockProducts++;
            }
        }


        // =========================================
        // RESPONSE
        // =========================================

        report.put("from", from);
        report.put("to", to);

        // Sales
        report.put("totalSales", totalSales);
        report.put("salesOrderCount", salesOrderCount);
        report.put("pendingOrders", pendingOrders);
        report.put("approvedOrders", approvedOrders);
        report.put("dispatchedOrders", dispatchedOrders);

        // Purchases
        report.put("totalPurchases", totalPurchases);
        report.put("purchaseOrderCount", purchaseOrderCount);
        report.put("orderedPurchases", orderedPurchases);
        report.put("receivedPurchases", receivedPurchases);

        // Invoices
        report.put("totalInvoiceAmount", totalInvoiceAmount);
        report.put("paidAmount", paidAmount);
        report.put("unpaidAmount", unpaidAmount);
        report.put("paidInvoices", paidInvoices);
        report.put("unpaidInvoices", unpaidInvoices);

        // Inventory
        report.put("totalProducts", totalProducts);
        report.put("totalStock", totalStock);
        report.put("lowStockProducts", lowStockProducts);
        report.put("outOfStockProducts", outOfStockProducts);

        return report;
    }
}

