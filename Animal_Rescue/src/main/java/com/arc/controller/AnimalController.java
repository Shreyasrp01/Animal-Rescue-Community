package com.arc.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.AnimalDTO;
import com.arc.dto.ApiResponse;
import com.arc.entities.AnimalStatus;
import com.arc.services.AnimalService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/animals")
@RequiredArgsConstructor
public class AnimalController {

    private final AnimalService animalService;
    private final ObjectMapper objectMapper;

    // CUSTOMER – REPORT ANIMAL
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<?> reportAnimal(
            @RequestPart("animal") String animalJson,
            @RequestPart(value = "photo", required = false)
                    MultipartFile photo
    ) throws Exception {

        AnimalDTO dto =
                objectMapper.readValue(animalJson, AnimalDTO.class);

        animalService.reportAnimal(dto, photo);

        return ResponseEntity.ok(
                new ApiResponse("Animal reported successfully", "SUCCESS")
        );
    }

    // ALL ROLES
    @GetMapping
    public ResponseEntity<?> getAllAnimals() {
        return ResponseEntity.ok(animalService.getAllAnimals());
    }

    // ALL ROLES
    @GetMapping("/{id}")
    public ResponseEntity<?> getAnimal(@PathVariable Long id) {
        return ResponseEntity.ok(animalService.getAnimalById(id));
    }

    // ADMIN
    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateAnimal(
            @PathVariable Long id,
            @RequestPart("animal") String animalJson,
            @RequestPart(value = "photo", required = false)
                    MultipartFile photo
    ) throws Exception {

        AnimalDTO dto =
                objectMapper.readValue(animalJson, AnimalDTO.class);

        animalService.updateAnimal(id, dto, photo);

        return ResponseEntity.ok(
                new ApiResponse("Animal updated successfully", "SUCCESS")
        );
    }

    // ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteAnimal(@PathVariable Long id) {

        animalService.deleteAnimal(id);

        return ResponseEntity.ok(
                new ApiResponse("Animal deleted successfully", "SUCCESS")
        );
    }
    
    
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateAnimalStatus(
            @PathVariable Long id,
            @RequestParam AnimalStatus status) {

        animalService.updateStatusOnly(id, status);

        return ResponseEntity.ok(
                new ApiResponse("Animal status updated", "SUCCESS")
        );
    }

}
