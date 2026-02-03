package com.arc.dto;

import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerDTO {

    private Long id;

    @Min(value = 0, message = "Total reports cannot be negative")
    private int totalReports;

    @Min(value = 0, message = "Total adoptions cannot be negative")
    private int totalAdoptions;
}
