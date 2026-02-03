package com.arc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arc.entities.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
