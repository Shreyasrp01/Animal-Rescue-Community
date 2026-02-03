package com.arc.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arc.dto.ApiResponse;
import com.arc.dto.CustomerDTO;
import com.arc.services.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('CUSTOMER')")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/profile")
    public ResponseEntity<CustomerDTO> getProfile() {
        return ResponseEntity.ok(customerService.getProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody CustomerDTO dto) {

        customerService.updateProfile(dto);

        return ResponseEntity.ok(
                new ApiResponse("Customer profile updated", "SUCCESS")
        );
    }
}
