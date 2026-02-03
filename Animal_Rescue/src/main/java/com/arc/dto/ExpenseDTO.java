package com.arc.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExpenseDTO {

    private Long id;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Amount must be greater than 0")
    @Digits(integer = 8, fraction = 2,
            message = "Amount format invalid")
    private BigDecimal amount;

    @Size(max = 100, message = "Paid to max length is 100")
    @JsonProperty("paidTo")
    private String paidTo;

    private String description;

    @JsonProperty("expenseProof")
    private String expenseProof;

    @JsonProperty("expenseDate")
    private LocalDate expenseDate;
}
