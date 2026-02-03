package com.arc.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DonorDTO {

    private Long id;

    @NotNull(message = "Total donated is required")
    @DecimalMin(value = "0.0", inclusive = true,
            message = "Donation amount cannot be negative")
    private BigDecimal totalDonated;
}
