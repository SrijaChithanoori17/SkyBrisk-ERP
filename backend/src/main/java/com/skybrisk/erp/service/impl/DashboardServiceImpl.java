package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.SalesOrder;
import com.skybrisk.erp.repository.ProductRepository;
import com.skybrisk.erp.repository.PurchaseOrderRepository;
import com.skybrisk.erp.repository.SalesOrderRepository;
import com.skybrisk.erp.service.DashboardService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final SalesOrderRepository salesOrderRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;

    public DashboardServiceImpl(
            SalesOrderRepository salesOrderRepository,
            PurchaseOrderRepository purchaseOrderRepository,
            ProductRepository productRepository) {

        this.salesOrderRepository = salesOrderRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Map<String, Object> getSalesSummary() {

        List<SalesOrder> orders =
                salesOrderRepository.findAll();

        LocalDate now = LocalDate.now();

        double totalSales = 0.0;

        int totalOrders = 0;
        int pendingOrders = 0;
        int approvedOrders = 0;
        int dispatchedOrders = 0;

        for (SalesOrder order : orders) {

            if (order.getOrderDate() == null) {
                continue;
            }

            if (order.getOrderDate().getYear() == now.getYear()
                    && order.getOrderDate().getMonth() == now.getMonth()) {

                totalOrders++;

                if (order.getTotalAmount() != null) {
                    totalSales += order.getTotalAmount();
                }

                if (order.getStatus() == SalesOrder.Status.PENDING) {
                    pendingOrders++;
                }

                if (order.getStatus() == SalesOrder.Status.APPROVED) {
                    approvedOrders++;
                }

                if (order.getStatus() == SalesOrder.Status.DISPATCHED) {
                    dispatchedOrders++;
                }
            }
        }

        Map<String, Object> summary = new HashMap<>();

        summary.put("month", now.getMonth().toString());
        summary.put("year", now.getYear());
        summary.put("totalSales", totalSales);
        summary.put("totalOrders", totalOrders);
        summary.put("pendingOrders", pendingOrders);
        summary.put("approvedOrders", approvedOrders);
        summary.put("dispatchedOrders", dispatchedOrders);

        return summary;
    }

    @Override
    public Map<String, Object> getPurchaseSummary() {

        List<com.skybrisk.erp.entity.PurchaseOrder> orders =
                purchaseOrderRepository.findAll();

        LocalDate now = LocalDate.now();

        double totalPurchases = 0.0;

        int totalOrders = 0;
        int orderedOrders = 0;
        int receivedOrders = 0;

        for (com.skybrisk.erp.entity.PurchaseOrder order : orders) {

            if (order.getExpectedDeliveryDate() == null) {
                continue;
            }

            if (order.getExpectedDeliveryDate().getYear() == now.getYear()
                    && order.getExpectedDeliveryDate().getMonth() == now.getMonth()) {

                totalOrders++;

                if (order.getStatus() ==
                        com.skybrisk.erp.entity.PurchaseOrder.Status.ORDERED) {

                    orderedOrders++;
                }

                if (order.getStatus() ==
                        com.skybrisk.erp.entity.PurchaseOrder.Status.RECEIVED) {

                    receivedOrders++;
                }

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

        Map<String, Object> summary = new HashMap<>();

        summary.put("month", now.getMonth().toString());
        summary.put("year", now.getYear());
        summary.put("totalPurchases", totalPurchases);
        summary.put("totalOrders", totalOrders);
        summary.put("orderedOrders", orderedOrders);
        summary.put("receivedOrders", receivedOrders);

        return summary;
    }

    @Override
    public List<?> getStockAlerts() {

        return productRepository.findAll()
                .stream()
                .filter(product ->
                        product.getCurrentStock() != null
                                && product.getReorderLevel() != null
                                && product.getCurrentStock()
                                <= product.getReorderLevel()
                )
                .toList();
    }
}