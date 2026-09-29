
        package com.skybrisk.erp.repository;

import com.skybrisk.erp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}

