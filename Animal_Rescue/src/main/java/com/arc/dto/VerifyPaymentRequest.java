package com.arc.dto;

import lombok.Data;

@Data
public class VerifyPaymentRequest {
    private String razorpay_order_id;
    private String razorpay_payment_id;
    private String razorpay_signature;
}
