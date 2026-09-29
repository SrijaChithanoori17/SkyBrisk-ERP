
        package com.skybrisk.erp.service.impl;

import com.skybrisk.erp.entity.Customer;
import com.skybrisk.erp.repository.CustomerRepository;
import com.skybrisk.erp.service.CustomerService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Customer not found"));
    }

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(
            Long id,
            Customer customer) {

        Customer existing = getCustomerById(id);

        existing.setName(customer.getName());
        existing.setEmail(customer.getEmail());
        existing.setPhone(customer.getPhone());
        existing.setAddress(customer.getAddress());
        existing.setGstin(customer.getGstin());

        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(Long id) {

        Customer customer = getCustomerById(id);

        customerRepository.delete(customer);
    }
}

