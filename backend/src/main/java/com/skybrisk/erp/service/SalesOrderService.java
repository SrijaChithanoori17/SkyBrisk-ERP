
        package com.skybrisk.erp.service;

import com.skybrisk.erp.entity.SalesOrder;

import java.util.List;

public interface SalesOrderService {

    List<SalesOrder> getAllSalesOrders();

    SalesOrder getSalesOrderById(Long id);

    SalesOrder createSalesOrder(SalesOrder salesOrder);

    SalesOrder updateSalesOrderStatus(Long id, String status);

    List<Object[]> getTopSellingProducts();
}

