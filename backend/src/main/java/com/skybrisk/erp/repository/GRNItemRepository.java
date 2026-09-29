package com.skybrisk.erp.repository;

import com.skybrisk.erp.entity.GRNItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GRNItemRepository
        extends JpaRepository<GRNItem, Long> {
}