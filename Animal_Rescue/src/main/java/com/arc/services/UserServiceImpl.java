package com.arc.services;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.arc.dto.UserDTO;
import com.arc.entities.Role;
import com.arc.entities.User;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.repositories.AdoptionRepository;
import com.arc.repositories.CustomerRepository;
import com.arc.repositories.DonorRepository;
import com.arc.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final CustomerRepository customerRepository;
    private final DonorRepository donorRepository;
    private final AdoptionRepository adoptionRepository;

    @Override
    public List<UserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> {
                    UserDTO dto = modelMapper.map(user, UserDTO.class);
                    dto.setPassword(null); // 🔒 never expose password
                    return dto;
                })
                .toList();
    }

    @Override
    public UserDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id " + id));

        UserDTO dto = modelMapper.map(user, UserDTO.class);
        dto.setPassword(null); // 🔒 safety

        return dto;
    }

    @Override
    public void updateUserRole(Long id, Role role) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id " + id));

        user.setRole(role);
    }
    
    @Override
    @Transactional
    public void deleteUser(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        // CUSTOMER cleanup
        if (user.getCustomer() != null) {
            Long customerId = user.getCustomer().getId();

            adoptionRepository.deleteByCustomerId(customerId);
            customerRepository.delete(user.getCustomer());
        }

        // DONOR cleanup
        if (user.getDonor() != null) {
            donorRepository.delete(user.getDonor());
        }

        // finally delete user
        userRepository.delete(user);
    }

}
