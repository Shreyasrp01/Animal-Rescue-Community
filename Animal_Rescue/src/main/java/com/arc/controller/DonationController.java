package com.arc.controller;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.ApiResponse;
import com.arc.dto.DonationDTO;
import com.arc.services.DonationService;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;
    private final ObjectMapper objectMapper;

    // DONOR – MAKE DONATION
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> donate(
            @RequestPart("donation") String donationJson,
            @RequestPart(value = "proof", required = false)
                    MultipartFile proof
    ) throws Exception {

        DonationDTO dto =
                objectMapper.readValue(donationJson, DonationDTO.class);

        donationService.makeDonation(dto, proof);

        return ResponseEntity.ok(
                new ApiResponse(
                        "Donation successful",
                        "SUCCESS")
        );
    }

    // DONOR
    @GetMapping("/my")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<?> myDonations() {
        return ResponseEntity.ok(
                donationService.getMyDonations());
    }

    // ADMIN
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> allDonations() {
        return ResponseEntity.ok(
                donationService.getAllDonations());
    }
}
