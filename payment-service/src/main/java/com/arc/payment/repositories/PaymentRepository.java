package com.arc.payment.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arc.payment.entities.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByTransactionId(String transactionId);
}
