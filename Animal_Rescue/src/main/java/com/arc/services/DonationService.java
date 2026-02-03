package com.arc.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.DonationDTO;

public interface DonationService {

    DonationDTO makeDonation(DonationDTO dto, MultipartFile proof);

    List<DonationDTO> getMyDonations();

    List<DonationDTO> getAllDonations();
}
