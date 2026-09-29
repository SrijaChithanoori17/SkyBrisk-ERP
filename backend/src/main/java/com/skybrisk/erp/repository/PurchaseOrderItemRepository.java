
        package com.skybrisk.erp.repository;

import com.skybrisk.erp.entity.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseOrderItemRepository
        extends JpaRepository<PurchaseOrderItem, Long> {
}

