package com.arc.services;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.arc.dto.DonorDTO;
import com.arc.entities.Donor;
import com.arc.entities.User;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonorServiceImpl implements DonorService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public DonorDTO getProfile() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Donor donor = user.getDonor();

        if (donor == null) {
            throw new ResourceNotFoundException("Donor profile not found");
        }

        return modelMapper.map(donor, DonorDTO.class);
    }

    @Override
    public DonorDTO updateProfile(DonorDTO dto) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        Donor donor = user.getDonor();

        if (donor == null) {
            throw new ResourceNotFoundException("Donor profile not found");
        }

        donor.setTotalDonated(dto.getTotalDonated());

        return modelMapper.map(donor, DonorDTO.class);
    }
}
