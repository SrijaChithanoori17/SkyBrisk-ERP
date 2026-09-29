package com.skybrisk.erp.repository;

import com.skybrisk.erp.entity.GRN;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GRNRepository extends JpaRepository<GRN, Long> {

        boolean existsByPurchaseOrderId(Long purchaseOrderId);
}