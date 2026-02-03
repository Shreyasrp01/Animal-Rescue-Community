package com.arc.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.arc.entities.PaymentStatus;
import com.arc.entities.PaymentType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentDTO {

    private Long id;

    @NotNull(message = "Reference id is required")
    private Long referenceId;

    @NotNull(message = "Payment type is required")
    private PaymentType paymentType;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Amount must be at least 1")
    private BigDecimal amount;

    // response-only
    private PaymentStatus status;

    // response-only
    private String transactionId;

    // response-only
    private LocalDateTime paymentDate;
}
