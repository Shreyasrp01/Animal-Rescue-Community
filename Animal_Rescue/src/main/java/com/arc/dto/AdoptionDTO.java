package com.arc.dto;

import java.time.LocalDate;

import com.arc.entities.Status;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdoptionDTO {

    // ================= COMMON =================
    private Long id;

    // ================= REQUEST FIELDS (VALIDATED) =================

    @NotNull(message = "Animal id is required")
    private Long animalId;

    @NotBlank(message = "Government ID is required")
    @Size(max = 30, message = "Govt ID max length is 30")
    private String govtId;

    // Govt ID photo filename (uploaded by customer)
    private String govtIdPhoto;

    // ================= RESPONSE FIELDS (NO VALIDATION) =================

    // Admin / response
    private Long customerId;

    private Status status;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate adoptionDate;

    // ================= ANIMAL DETAILS =================
    private String animalName;
    private String animalCategory;
    private String animalPhoto;

    // ================= CUSTOMER DETAILS =================
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String customerAddress;
}
