package com.arc.dto;

import com.arc.entities.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponseDTO {

    private String token;
    private String name;   // ✅ ADD THIS
    private String email;
    private Role role;
}
