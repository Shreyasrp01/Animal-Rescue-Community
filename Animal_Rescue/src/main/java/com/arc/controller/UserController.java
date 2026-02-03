package com.arc.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.arc.dto.ApiResponse;
import com.arc.dto.UserDTO;
import com.arc.entities.Role;
import com.arc.services.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class UserController {

    private final UserService userService;

    // ================= GET ALL USERS =================
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // ================= GET USER BY ID =================
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // ================= UPDATE USER ROLE =================
    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse> updateUserRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {
        userService.updateUserRole(id, role);

        return ResponseEntity.ok(
                new ApiResponse("User role updated successfully", "SUCCESS")
        );
    }
    
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
            new ApiResponse("User deleted successfully", "SUCCESS")
        );
    }

}
