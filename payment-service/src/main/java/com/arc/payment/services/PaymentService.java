package com.arc.payment.services;

import com.arc.payment.dto.CreateOrderRequest;
import com.arc.payment.dto.CreateOrderResponse;
import com.arc.payment.dto.VerifyPaymentRequest;

public interface PaymentService {

    CreateOrderResponse createOrder(CreateOrderRequest dto);

    void verifyPayment(VerifyPaymentRequest dto);
}
