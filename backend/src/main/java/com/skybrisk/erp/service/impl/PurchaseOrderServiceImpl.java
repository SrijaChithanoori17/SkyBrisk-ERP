
        package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.PurchaseOrder;
import com.skybrisk.erp.entity.PurchaseOrderItem;
import com.skybrisk.erp.entity.Product;
import com.skybrisk.erp.repository.PurchaseOrderRepository;
import com.skybrisk.erp.repository.ProductRepository;
import com.skybrisk.erp.service.PurchaseOrderService;
import org.springframework.stereotype.Service;
import com.skybrisk.erp.repository.GRNRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PurchaseOrderServiceImpl implements PurchaseOrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final GRNRepository grnRepository;

    public PurchaseOrderServiceImpl(
            PurchaseOrderRepository purchaseOrderRepository,
            ProductRepository productRepository,
            GRNRepository grnRepository) {

        this.purchaseOrderRepository = purchaseOrderRepository;
        this.productRepository = productRepository;
        this.grnRepository = grnRepository;
    }

    @Override
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Override
    public PurchaseOrder getPurchaseOrderById(Long id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Purchase Order not found"));
    }

    @Override
    public PurchaseOrder createPurchaseOrder(
            PurchaseOrder purchaseOrder) {

        for (PurchaseOrderItem item : purchaseOrder.getItems()) {

            Product product = productRepository
                    .findById(item.getProduct().getId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            item.setProduct(product);
            item.setPurchaseOrder(purchaseOrder);
        }

        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    public PurchaseOrder updatePurchaseOrder(
            Long id,
            PurchaseOrder purchaseOrder) {

        PurchaseOrder existing =
                getPurchaseOrderById(id);

        existing.setSupplier(
                purchaseOrder.getSupplier()
        );

        existing.setExpectedDeliveryDate(
                purchaseOrder.getExpectedDeliveryDate()
        );

        existing.setStatus(
                purchaseOrder.getStatus()
        );

        existing.getItems().clear();

        for (PurchaseOrderItem item :
                purchaseOrder.getItems()) {

            Product product = productRepository
                    .findById(item.getProduct().getId())
                    .orElseThrow(() ->
                            new RuntimeException("Product not found"));

            item.setProduct(product);
            item.setPurchaseOrder(existing);

            existing.getItems().add(item);
        }

        return purchaseOrderRepository.save(existing);
    }

    @Override
    public PurchaseOrder updatePurchaseOrderStatus(
            Long id,
            String status) {

        PurchaseOrder purchaseOrder =
                getPurchaseOrderById(id);

        purchaseOrder.setStatus(
                PurchaseOrder.Status.valueOf(
                        status.toUpperCase()
                )
        );

        return purchaseOrderRepository.save(purchaseOrder);
    }

    @Override
    @Transactional
    public void deletePurchaseOrder(Long id) {

        PurchaseOrder purchaseOrder = purchaseOrderRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Purchase Order not found"));

        if (grnRepository.existsByPurchaseOrderId(id)) {
            throw new RuntimeException(
                    "Cannot delete Purchase Order because a GRN already exists for this order"
            );
        }

        purchaseOrderRepository.delete(purchaseOrder);
    }
}

