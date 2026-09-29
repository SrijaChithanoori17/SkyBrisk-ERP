package com.skybrisk.erp.service;

import com.skybrisk.erp.entity.Supplier;

import java.util.List;

public interface SupplierService {

    List<Supplier> getAllSuppliers();

    Supplier getSupplierById(Long id);

    Supplier createSupplier(Supplier supplier);

    Supplier updateSupplier(Long id, Supplier supplier);

    void deleteSupplier(Long id);
}