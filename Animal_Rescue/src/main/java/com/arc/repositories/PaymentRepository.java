package com.arc.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arc.entities.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Find payments by reference (donation/adoption)
    List<Payment> findByReferenceId(Long referenceId);

    // Find payment by Razorpay order id (transactionId)
    Optional<Payment> findByTransactionId(String transactionId);
}
