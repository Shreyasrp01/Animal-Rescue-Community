package com.arc.services;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.DonationDTO;
import com.arc.entities.Donation;
import com.arc.entities.Donor;
import com.arc.entities.User;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.exceptions.UnauthorizedActionException;
import com.arc.repositories.DonationRepository;
import com.arc.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final FileService fileService;
    private final ModelMapper modelMapper;

    // ================= HELPERS =================

    private String getEmail() {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
    }

    private boolean hasRole(String role) {
        return SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    private Donor getLoggedDonor() {

        User user = userRepository.findByEmail(getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getDonor() == null) {
            throw new UnauthorizedActionException(
                    "Donor profile not found");
        }
        return user.getDonor();
    }

    // ================= SERVICES =================

    // DONOR
    @Override
    public DonationDTO makeDonation(
            DonationDTO dto,
            MultipartFile proof) {

        if (!hasRole("DONOR")) {
            throw new UnauthorizedActionException(
                    "Only donor can donate");
        }

        Donor donor = getLoggedDonor();

        Donation donation = new Donation();
        donation.setDonor(donor);
        donation.setAmount(dto.getAmount());
        donation.setPaymentMethod(dto.getPaymentMethod());
        donation.setDonationDate(LocalDate.now());

        try {
            if (proof != null && !proof.isEmpty()) {
                donation.setDonationProof(
                        fileService.saveFile(proof));
            }
        } catch (IOException e) {
            throw new RuntimeException(
                    "Donation proof upload failed");
        }

        Donation saved = donationRepository.save(donation);

        // update donor total
        donor.setTotalDonated(
                donor.getTotalDonated().add(dto.getAmount()));

        DonationDTO response =
                modelMapper.map(saved, DonationDTO.class);
        response.setDonorId(donor.getId());
        return response;
    }

    // DONOR
    @Override
    public List<DonationDTO> getMyDonations() {

        Donor donor = getLoggedDonor();

        return donationRepository.findByDonorId(donor.getId())
                .stream()
                .map(d -> {
                    DonationDTO dto =
                            modelMapper.map(d, DonationDTO.class);
                    dto.setDonorId(donor.getId());
                    return dto;
                })
                .toList();
    }

    // ADMIN
    @Override
    public List<DonationDTO> getAllDonations() {

        if (!hasRole("ADMIN")) {
            throw new UnauthorizedActionException(
                    "Only admin can view donations");
        }

        return donationRepository.findAll()
                .stream()
                .map(d -> {
                    DonationDTO dto =
                            modelMapper.map(d, DonationDTO.class);
                    dto.setDonorId(d.getDonor().getId());
                    return dto;
                })
                .toList();
    }
}
