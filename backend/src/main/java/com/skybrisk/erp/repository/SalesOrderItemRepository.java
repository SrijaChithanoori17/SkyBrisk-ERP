
        package com.skybrisk.erp.repository;

import com.skybrisk.erp.entity.SalesOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SalesOrderItemRepository
        extends JpaRepository<SalesOrderItem, Long> {

    @Query("""
            SELECT item.product.id,
                   item.product.productName,
                   SUM(item.quantity)
            FROM SalesOrderItem item
            GROUP BY item.product.id, item.product.productName
            ORDER BY SUM(item.quantity) DESC
            """)
    List<Object[]> findTopSellingProducts();
}

