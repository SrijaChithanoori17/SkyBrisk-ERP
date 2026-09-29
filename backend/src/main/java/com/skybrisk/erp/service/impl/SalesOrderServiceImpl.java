
        package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.Customer;
import com.skybrisk.erp.entity.Product;
import com.skybrisk.erp.entity.SalesOrder;
import com.skybrisk.erp.entity.SalesOrderItem;
import com.skybrisk.erp.repository.CustomerRepository;
import com.skybrisk.erp.repository.ProductRepository;
import com.skybrisk.erp.repository.SalesOrderRepository;
import com.skybrisk.erp.service.SalesOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.skybrisk.erp.repository.SalesOrderItemRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class SalesOrderServiceImpl implements SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final SalesOrderItemRepository salesOrderItemRepository;
    public SalesOrderServiceImpl(
            SalesOrderRepository salesOrderRepository,
            ProductRepository productRepository,
            CustomerRepository customerRepository,
            SalesOrderItemRepository salesOrderItemRepository) {

        this.salesOrderRepository = salesOrderRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.salesOrderItemRepository = salesOrderItemRepository;
    }

    @Override
    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    @Override
    public SalesOrder getSalesOrderById(Long id) {
        return salesOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Sales Order not found"));
    }

    @Override
    @Transactional
    public SalesOrder createSalesOrder(SalesOrder salesOrder) {

        // Validate Customer
        if (salesOrder.getCustomer() == null ||
                salesOrder.getCustomer().getId() == null) {

            throw new RuntimeException("Customer is required");
        }

        Long customerId = salesOrder.getCustomer().getId();

        Customer customer = customerRepository
                .findById(customerId)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));

        salesOrder.setCustomer(customer);

        // Validate Items
        if (salesOrder.getItems() == null ||
                salesOrder.getItems().isEmpty()) {

            throw new RuntimeException(
                    "Sales Order must contain at least one item");
        }

        double totalAmount = 0;

        // Process each item
        for (SalesOrderItem item : salesOrder.getItems()) {

            if (item.getProduct() == null ||
                    item.getProduct().getId() == null) {

                throw new RuntimeException("Product is required");
            }

            if (item.getQuantity() == null ||
                    item.getQuantity() <= 0) {

                throw new RuntimeException(
                        "Quantity must be greater than 0");
            }

            Long productId = item.getProduct().getId();

            Product product = productRepository
                    .findById(productId)
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            // Check current stock
            int currentStock =
                    product.getCurrentStock() != null
                            ? product.getCurrentStock()
                            : 0;

            int requestedQuantity = item.getQuantity();

            if (requestedQuantity > currentStock) {

                throw new RuntimeException(
                        "Insufficient stock for product: "
                                + product.getProductName()
                                + ". Available stock: "
                                + currentStock
                                + ", Requested: "
                                + requestedQuantity);
            }

            // Reduce stock
            product.setCurrentStock(
                    currentStock - requestedQuantity
            );

            productRepository.save(product);

            // Connect actual product and order
            item.setProduct(product);
            item.setSalesOrder(salesOrder);

            // Calculate item total
            double itemTotal =
                    product.getUnitPrice() * requestedQuantity;

            totalAmount += itemTotal;
        }

        // Set today's date if not provided
        if (salesOrder.getOrderDate() == null) {
            salesOrder.setOrderDate(LocalDate.now());
        }

        // Set default status
        if (salesOrder.getStatus() == null) {
            salesOrder.setStatus(
                    SalesOrder.Status.PENDING
            );
        }

        // Set calculated total amount
        salesOrder.setTotalAmount(totalAmount);

        // Save Sales Order
        return salesOrderRepository.save(salesOrder);
    }

    @Override
    public SalesOrder updateSalesOrderStatus(
            Long id,
            String status) {

        SalesOrder salesOrder =
                getSalesOrderById(id);

        try {

            salesOrder.setStatus(
                    SalesOrder.Status.valueOf(
                            status.toUpperCase()
                    )
            );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid sales order status: " + status
            );
        }

        return salesOrderRepository.save(salesOrder);
    }

    @Override
    public List<Object[]> getTopSellingProducts() {
        return salesOrderItemRepository.findTopSellingProducts();
    }
}

