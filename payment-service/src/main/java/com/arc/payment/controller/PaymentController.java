package com.arc.payment.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arc.payment.dto.ApiResponse;
import com.arc.payment.dto.CreateOrderRequest;
import com.arc.payment.dto.CreateOrderResponse;
import com.arc.payment.dto.VerifyPaymentRequest;
import com.arc.payment.services.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<CreateOrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest dto) {
        CreateOrderResponse response = paymentService.createOrder(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<ApiResponse> verifyPayment(@Valid @RequestBody VerifyPaymentRequest dto) {
        paymentService.verifyPayment(dto);
        return ResponseEntity.ok(new ApiResponse("Payment verified successfully", "SUCCESS"));
    }
}
