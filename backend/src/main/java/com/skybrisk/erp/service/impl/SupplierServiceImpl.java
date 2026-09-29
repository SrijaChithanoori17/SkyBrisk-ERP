
        package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.Supplier;
import com.skybrisk.erp.repository.SupplierRepository;
import com.skybrisk.erp.service.SupplierService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @Override
    public Supplier getSupplierById(Long id) {
        return supplierRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Supplier not found"));
    }

    @Override
    public Supplier createSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    @Override
    public Supplier updateSupplier(Long id, Supplier supplier) {

        Supplier existing = getSupplierById(id);

        existing.setName(supplier.getName());
        existing.setEmail(supplier.getEmail());
        existing.setPhone(supplier.getPhone());
        existing.setAddress(supplier.getAddress());
        existing.setGstin(supplier.getGstin());

        return supplierRepository.save(existing);
    }

    @Override
    public void deleteSupplier(Long id) {

        Supplier supplier = getSupplierById(id);

        supplierRepository.delete(supplier);
    }
}

