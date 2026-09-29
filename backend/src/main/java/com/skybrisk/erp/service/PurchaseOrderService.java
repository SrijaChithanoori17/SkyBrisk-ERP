
        package com.skybrisk.erp.service;

import com.skybrisk.erp.entity.PurchaseOrder;

import java.util.List;

public interface PurchaseOrderService {

    List<PurchaseOrder> getAllPurchaseOrders();

    PurchaseOrder getPurchaseOrderById(Long id);

    PurchaseOrder createPurchaseOrder(PurchaseOrder purchaseOrder);

    PurchaseOrder updatePurchaseOrder(
            Long id,
            PurchaseOrder purchaseOrder
    );
    PurchaseOrder updatePurchaseOrderStatus(
            Long id,
            String status
    );

    void deletePurchaseOrder(Long id);
}

