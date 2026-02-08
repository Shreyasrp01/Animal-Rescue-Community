package com.arc.payment.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CreateOrderResponse {
    private String orderId;
    private BigDecimal amount;
    private String razorpayKey;
}
