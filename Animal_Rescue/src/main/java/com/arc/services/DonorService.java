package com.arc.services;

import com.arc.dto.DonorDTO;

public interface DonorService {

    DonorDTO getProfile();

    DonorDTO updateProfile(DonorDTO dto);
}
