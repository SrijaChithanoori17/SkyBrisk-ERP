package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.GRN;
import com.skybrisk.erp.entity.GRNItem;
import com.skybrisk.erp.entity.Product;
import com.skybrisk.erp.entity.PurchaseOrder;
import com.skybrisk.erp.repository.GRNRepository;
import com.skybrisk.erp.repository.ProductRepository;
import com.skybrisk.erp.repository.PurchaseOrderRepository;
import com.skybrisk.erp.service.GRNService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GRNServiceImpl implements GRNService {

    private final GRNRepository grnRepository;
    private final ProductRepository productRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;

    public GRNServiceImpl(
            GRNRepository grnRepository,
            ProductRepository productRepository,
            PurchaseOrderRepository purchaseOrderRepository) {

        this.grnRepository = grnRepository;
        this.productRepository = productRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
    }

    @Override
    public List<GRN> getAllGRNs() {

        return grnRepository.findAll();
    }

    @Override
    public GRN getGRNById(Long id) {

        return grnRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("GRN not found"));
    }

    @Override
    @Transactional
    public GRN createGRN(GRN grn) {

        // Validate Purchase Order
        if (grn.getPurchaseOrder() == null ||
                grn.getPurchaseOrder().getId() == null) {

            throw new RuntimeException(
                    "Purchase Order is required"
            );
        }

        Long purchaseOrderId =
                grn.getPurchaseOrder().getId();


        // Get actual Purchase Order from database
        PurchaseOrder purchaseOrder =
                purchaseOrderRepository
                        .findById(purchaseOrderId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Purchase Order not found"
                                ));


        // Prevent duplicate GRN
        if (grnRepository.existsByPurchaseOrderId(
                purchaseOrderId)) {

            throw new RuntimeException(
                    "GRN already exists for this Purchase Order"
            );
        }


        // PO must be ORDERED before receiving
        if (purchaseOrder.getStatus()
                != PurchaseOrder.Status.ORDERED) {

            throw new RuntimeException(
                    "Purchase Order is not in ORDERED status"
            );
        }


        // Connect actual PO object
        grn.setPurchaseOrder(purchaseOrder);


        // Validate and process GRN items
        for (GRNItem item : grn.getItems()) {

            if (item.getProduct() == null ||
                    item.getProduct().getId() == null) {

                throw new RuntimeException(
                        "Product is required"
                );
            }


            if (item.getQuantityReceived() == null ||
                    item.getQuantityReceived() <= 0) {

                throw new RuntimeException(
                        "Received quantity must be greater than 0"
                );
            }


            // Get actual product from database
            Product product =
                    productRepository
                            .findById(
                                    item.getProduct().getId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Product not found"
                                    ));


            // Current stock
            int currentStock =
                    product.getCurrentStock() != null
                            ? product.getCurrentStock()
                            : 0;


            // Received quantity
            int quantityReceived =
                    item.getQuantityReceived();


            // Increase stock
            product.setCurrentStock(
                    currentStock + quantityReceived
            );


            // Save updated product
            productRepository.save(product);


            // Connect item to GRN
            item.setProduct(product);
            item.setGrn(grn);
        }


        // Mark Purchase Order as RECEIVED
        purchaseOrder.setStatus(
                PurchaseOrder.Status.RECEIVED
        );

        purchaseOrderRepository.save(
                purchaseOrder
        );


        // Save GRN
        return grnRepository.save(grn);
    }
}