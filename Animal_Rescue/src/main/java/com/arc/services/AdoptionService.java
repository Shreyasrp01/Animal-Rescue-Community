package com.arc.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.AdoptionDTO;
import com.arc.entities.Status;

public interface AdoptionService {

    AdoptionDTO requestAdoption(AdoptionDTO dto, MultipartFile govtIdPhoto);

    List<AdoptionDTO> getAllAdoptions();

    List<AdoptionDTO> getMyAdoptions();

    void updateStatus(Long adoptionId, Status status);
}
