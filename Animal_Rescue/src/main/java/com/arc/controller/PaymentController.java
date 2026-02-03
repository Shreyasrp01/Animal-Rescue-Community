package com.arc.controller;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.arc.dto.ApiResponse;
import com.arc.dto.CreateOrderRequest;
import com.arc.dto.CreateOrderResponse;
import com.arc.dto.PaymentDTO;
import com.arc.dto.VerifyPaymentRequest;
import com.arc.services.PaymentService;

import lombok.RequiredArgsConstructor;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DONOR')")
public class PaymentController {

    private final PaymentService paymentService;

    // ================= CREATE ORDER =================
    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest dto) {

        CreateOrderResponse response =
                paymentService.createOrder(dto);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // ================= VERIFY PAYMENT =================
    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest dto) {

        paymentService.verifyPayment(dto);

        return ResponseEntity.ok(
                new ApiResponse("Payment verified successfully", "SUCCESS")
        );
    }

    // ================= PAYMENT HISTORY =================
    @GetMapping("/my")
    public ResponseEntity<List<PaymentDTO>> myPayments() {

        List<PaymentDTO> payments =
                paymentService.getMyPayments();

        return ResponseEntity.ok(payments);
    }
}
