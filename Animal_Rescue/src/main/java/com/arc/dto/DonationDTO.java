package com.arc.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.arc.entities.PaymentMethod;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonationDTO {

    private Long id;

    // response-only
    private Long donorId;

    @NotNull(message = "Donation amount is required")
    @DecimalMin(value = "1.0", message = "Donation must be at least 1")
    private BigDecimal amount;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private LocalDate donationDate;

    // stored filename
    private String donationProof;
}
