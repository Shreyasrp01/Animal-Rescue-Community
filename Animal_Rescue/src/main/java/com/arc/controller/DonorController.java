package com.arc.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arc.dto.ApiResponse;
import com.arc.dto.DonorDTO;
import com.arc.services.DonorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/donor")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DONOR')")
public class DonorController {

    private final DonorService donorService;

    @GetMapping("/profile")
    public ResponseEntity<DonorDTO> getProfile() {
        return ResponseEntity.ok(donorService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody DonorDTO dto) {

        donorService.updateProfile(dto);

        return ResponseEntity.ok(
                new ApiResponse("Donor profile updated", "SUCCESS")
        );
    }
}
