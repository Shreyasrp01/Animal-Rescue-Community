package com.arc.services;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.AdoptionDTO;
import com.arc.entities.Adoption;
import com.arc.entities.Animal;
import com.arc.entities.Customer;
import com.arc.entities.Status;
import com.arc.entities.User;
import com.arc.exceptions.DuplicateAdoptionException;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.exceptions.UnauthorizedActionException;
import com.arc.repositories.AdoptionRepository;
import com.arc.repositories.AnimalRepository;
import com.arc.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
;

@Service
@RequiredArgsConstructor
public class AdoptionServiceImpl implements AdoptionService {

    private final AdoptionRepository adoptionRepository;
    private final AnimalRepository animalRepository;
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

    private Customer getLoggedCustomer() {

        User user = userRepository.findByEmail(getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getCustomer() == null) {
            throw new UnauthorizedActionException(
                    "Customer profile not found");
        }
        return user.getCustomer();
    }

    // ================= SERVICES =================

    // CUSTOMER
    @Override
    public AdoptionDTO requestAdoption(
            AdoptionDTO dto,
            MultipartFile govtIdPhoto) {

        // 🔐 Role check
        if (!hasRole("CUSTOMER")) {
            throw new UnauthorizedActionException(
                    "Only customer can request adoption");
        }

        // 🛑 BASIC VALIDATION (VERY IMPORTANT)
        if (dto == null || dto.getAnimalId() == null) {
            throw new IllegalArgumentException("Animal ID is required");
        }

        if (dto.getGovtId() == null || dto.getGovtId().isBlank()) {
            throw new IllegalArgumentException("Government ID is required");
        }

        if (govtIdPhoto == null || govtIdPhoto.isEmpty()) {
            throw new IllegalArgumentException("Government ID photo is required");
        }

        Long customerId = getLoggedCustomer().getId();
        Long animalId = dto.getAnimalId();

        // 🔒 DUPLICATE CHECK (must stay)
        boolean exists =
            adoptionRepository.existsByCustomer_IdAndAnimal_IdAndStatusIn(
                customerId,
                animalId,
                List.of(Status.PENDING, Status.APPROVED)
            );

        if (exists) {
            throw new DuplicateAdoptionException(
                "You have already requested adoption for this animal"
            );
        }

        // 🐾 Validate animal
        Animal animal = animalRepository.findById(animalId)
                .orElseThrow(() ->
                    new ResourceNotFoundException("Animal not found")
                );

        // ✅ SAFE mapping (controlled)
        Adoption adoption = new Adoption();
        adoption.setGovtId(dto.getGovtId());

        // 🔐 Backend-controlled fields
        adoption.setAnimal(animal);
        adoption.setCustomer(getLoggedCustomer());
        adoption.setStatus(Status.PENDING);
        adoption.setAdoptionDate(LocalDate.now());

        // 📁 File upload
        try {
            adoption.setGovtIdPhoto(
                    fileService.saveFile(govtIdPhoto));
        } catch (IOException e) {
            throw new RuntimeException("Govt ID upload failed");
        }

        Adoption saved = adoptionRepository.save(adoption);

        // 📤 Response DTO
        AdoptionDTO response = modelMapper.map(saved, AdoptionDTO.class);
        response.setAnimalId(saved.getAnimal().getId());
        response.setCustomerId(saved.getCustomer().getId());

        return response;
    }




    // ADMIN
  
    @Override
    public List<AdoptionDTO> getAllAdoptions() {

        if (!hasRole("ADMIN")) {
            throw new UnauthorizedActionException("Only admin can view adoptions");
        }

        return adoptionRepository.findAllWithDetails()
                .stream()
                .map(adoption -> {

                    // 1️⃣ Auto-map simple fields
                    AdoptionDTO dto =
                            modelMapper.map(adoption, AdoptionDTO.class);

                    // 2️⃣ Manual mapping for relations
                    dto.setAnimalId(adoption.getAnimal().getId());
                    dto.setAnimalName(adoption.getAnimal().getName());
                    dto.setAnimalCategory(adoption.getAnimal().getCategory());
                    dto.setAnimalPhoto(adoption.getAnimal().getPhoto());

                    dto.setCustomerId(adoption.getCustomer().getId());
                    dto.setCustomerName(adoption.getCustomer().getUser().getName());
                    dto.setCustomerEmail(adoption.getCustomer().getUser().getEmail());
                    dto.setCustomerPhone(adoption.getCustomer().getUser().getPhone());
                    dto.setCustomerAddress(adoption.getCustomer().getUser().getAddress());

                    return dto;
                })
                .toList();
    }

    // CUSTOMER
    @Override
    public List<AdoptionDTO> getMyAdoptions() {

        Customer customer = getLoggedCustomer();

        return adoptionRepository.findByCustomerId(customer.getId())
                .stream()
                .map(adoption -> modelMapper.map(adoption, AdoptionDTO.class))
                .toList();
    }

    // ADMIN
    @Transactional
    @Override
    public void updateStatus(Long adoptionId, Status status) {

        if (!hasRole("ADMIN")) {
            throw new UnauthorizedActionException(
                    "Only admin can update status");
        }

        Adoption adoption = adoptionRepository.findById(adoptionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Adoption not found"));

        adoption.setStatus(status);
    }
}
