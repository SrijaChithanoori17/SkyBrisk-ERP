package com.skybrisk.erp.repository;

import com.skybrisk.erp.entity.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SalesOrderRepository
        extends JpaRepository<SalesOrder, Long> {
}