
        package com.skybrisk.erp.repository;

import com.skybrisk.erp.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}

