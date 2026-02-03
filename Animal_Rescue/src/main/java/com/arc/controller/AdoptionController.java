package com.arc.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.AdoptionDTO;
import com.arc.dto.ApiResponse;
import com.arc.entities.Status;
import com.arc.services.AdoptionService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/adoptions")
@RequiredArgsConstructor
public class AdoptionController {

    private final AdoptionService adoptionService;
    private final ObjectMapper objectMapper;

    // CUSTOMER – REQUEST ADOPTION
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> requestAdoption(
            @RequestPart("adoption") String adoptionJson,
            @RequestPart("govtIdPhoto") MultipartFile govtIdPhoto
    ) throws Exception {

        AdoptionDTO dto =
                objectMapper.readValue(adoptionJson, AdoptionDTO.class);

        adoptionService.requestAdoption(dto, govtIdPhoto);

        return ResponseEntity.ok(
                new ApiResponse(
                        "Adoption request submitted",
                        "SUCCESS")
        );
    }

    // ADMIN
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> getAllAdoptions() {
        return ResponseEntity.ok(
                adoptionService.getAllAdoptions());
    }

    // CUSTOMER
    @GetMapping("/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> getMyAdoptions() {
        return ResponseEntity.ok(
                adoptionService.getMyAdoptions());
    }

    // ADMIN
    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam Status status) {

        adoptionService.updateStatus(id, status);

        return ResponseEntity.ok(
                new ApiResponse(
                        "Adoption status updated",
                        "SUCCESS")
        );
    }
}
