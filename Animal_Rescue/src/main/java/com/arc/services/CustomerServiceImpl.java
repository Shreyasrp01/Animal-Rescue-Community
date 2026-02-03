package com.arc.services;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.arc.dto.CustomerDTO;
import com.arc.entities.Customer;
import com.arc.entities.User;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public CustomerDTO getProfile() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Customer customer = user.getCustomer();

        if (customer == null) {
            throw new ResourceNotFoundException("Customer profile not found");
        }

        return modelMapper.map(customer, CustomerDTO.class);
    }

    @Override
    public CustomerDTO updateProfile(CustomerDTO dto) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Customer customer = user.getCustomer();

        if (customer == null) {
            throw new ResourceNotFoundException("Customer profile not found");
        }

        // Only allowed fields are mapped
        customer.setTotalReports(dto.getTotalReports());
        customer.setTotalAdoptions(dto.getTotalAdoptions());

        return modelMapper.map(customer, CustomerDTO.class);
    }
}
