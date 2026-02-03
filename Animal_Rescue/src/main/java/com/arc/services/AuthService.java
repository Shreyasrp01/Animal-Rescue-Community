package com.arc.services;

import com.arc.dto.AuthResponseDTO;
import com.arc.dto.LoginDTO;
import com.arc.dto.UserDTO;

public interface AuthService {

    void signup(UserDTO dto);

    AuthResponseDTO login(LoginDTO dto);

    void logout(); // JWT is stateless
}
