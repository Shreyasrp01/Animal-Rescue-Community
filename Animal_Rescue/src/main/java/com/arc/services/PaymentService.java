package com.arc.services;

import java.util.List;

import com.arc.dto.CreateOrderRequest;
import com.arc.dto.CreateOrderResponse;
import com.arc.dto.PaymentDTO;
import com.arc.dto.VerifyPaymentRequest;

public interface PaymentService {

    CreateOrderResponse createOrder(CreateOrderRequest dto);

    void verifyPayment(VerifyPaymentRequest dto);

    List<PaymentDTO> getMyPayments();
}
