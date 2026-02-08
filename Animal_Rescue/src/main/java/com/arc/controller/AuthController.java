package com.arc.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.arc.dto.ApiResponse;
import com.arc.dto.AuthResponseDTO;
import com.arc.dto.LoginDTO;
import com.arc.dto.UserDTO;
import com.arc.services.AuthService;
import com.arc.services.ExternalLoggerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final ExternalLoggerService loggerService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody UserDTO dto) {

        authService.signup(dto);
        loggerService.log("New user signup: " + dto.getEmail());

        return ResponseEntity.ok(
                new ApiResponse("User registered successfully", "SUCCESS")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @Valid @RequestBody LoginDTO dto) {
        
        loggerService.log("User login attempt: " + dto.getEmail());
        return ResponseEntity.ok(authService.login(dto));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {

        authService.logout();
        loggerService.log("User logout");

        return ResponseEntity.ok(
                new ApiResponse("Logged out successfully", "SUCCESS")
        );
    }
}
