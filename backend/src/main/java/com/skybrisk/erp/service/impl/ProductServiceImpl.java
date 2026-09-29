
        package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.Product;
import com.skybrisk.erp.repository.ProductRepository;
import com.skybrisk.erp.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service public class             ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsForSales() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found with id: " + id
                        )
                );
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product product) {

        Product existingProduct = getProductById(id);

        existingProduct.setProductName(product.getProductName());
        existingProduct.setSku(product.getSku());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setUnitPrice(product.getUnitPrice());
        existingProduct.setCurrentStock(product.getCurrentStock());
        existingProduct.setReorderLevel(product.getReorderLevel());

        return productRepository.save(existingProduct);
    }

    @Override
    public void deleteProduct(Long id) {

        Product product = getProductById(id);

        productRepository.delete(product);
    }
}

