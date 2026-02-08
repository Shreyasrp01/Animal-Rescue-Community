package com.arc.payment.dto;

import java.math.BigDecimal;

import com.arc.payment.entities.PaymentType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateOrderRequest {

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", inclusive = true, message = "Amount must be at least ₹1")
    private BigDecimal amount;

    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;

    @NotNull(message = "Reference ID is required")
    @Positive(message = "Reference ID must be a positive number")
    private Long referenceId;
}
