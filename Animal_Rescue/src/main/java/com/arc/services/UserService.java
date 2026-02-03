package com.arc.services;

import java.util.List;

import com.arc.dto.UserDTO;
import com.arc.entities.Role;

public interface UserService {

    List<UserDTO> getAllUsers();

    UserDTO getUserById(Long id);

    void updateUserRole(Long id, Role role);
    
    void deleteUser(Long userId);

}
