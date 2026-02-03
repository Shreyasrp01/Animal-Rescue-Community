package com.arc.dto;

import com.arc.entities.AnimalStatus;
import com.arc.entities.Gender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AnimalDTO {

    private Long id;

    @NotBlank(message = "Animal name is required")
    @Size(max = 20, message = "Name must be max 20 characters")
    private String name;

    @NotBlank(message = "Category is required")
    @Size(max = 20, message = "Category must be max 20 characters")
    private String category;

    @Size(max = 20, message = "Breed must be max 20 characters")
    private String breed;

    @PositiveOrZero(message = "Age cannot be negative")
    private double age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    private boolean vaccinated;

    private boolean dewormed;

    @NotBlank(message = "Location is required")
    @Size(max = 50, message = "Location must be max 50 characters")
    private String location;

    private String description;

    // stored filename (not MultipartFile)
    private String photo;

    @NotNull(message = "Animal status is required")
    private AnimalStatus status;

    // response-only
    private Long reportedByCustomerId;
}
