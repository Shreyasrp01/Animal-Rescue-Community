package com.arc.services;

import com.arc.dto.CustomerDTO;

public interface CustomerService {

    CustomerDTO getProfile();

    CustomerDTO updateProfile(CustomerDTO dto);
}
