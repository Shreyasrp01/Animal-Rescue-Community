package com.arc.services;

import java.io.IOException;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.AnimalDTO;
import com.arc.entities.Animal;
import com.arc.entities.AnimalStatus;
import com.arc.entities.Customer;
import com.arc.entities.User;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.exceptions.UnauthorizedActionException;
import com.arc.repositories.AdoptionRepository;
import com.arc.repositories.AnimalRepository;
import com.arc.repositories.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AnimalServiceImpl implements AnimalService {

    private final AnimalRepository animalRepository;
    private final UserRepository userRepository;
    private final FileService fileService;
    private final ModelMapper modelMapper;
    private final AdoptionRepository adoptionRepository;


    // ================= HELPERS =================

    private String getLoggedInEmail() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    private boolean hasRole(String role) {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_" + role));
    }

    private Customer getLoggedCustomer() {

        User user = userRepository.findByEmail(getLoggedInEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));

        if (user.getCustomer() == null) {
            throw new UnauthorizedActionException("Customer profile not found");
        }

        return user.getCustomer();
    }

    // ================= SERVICE METHODS =================

    // CUSTOMER
    @Override
    public AnimalDTO reportAnimal(AnimalDTO dto, MultipartFile photo) {

        if (!hasRole("CUSTOMER")) {
            throw new UnauthorizedActionException(
                    "Only customers can report animals");
        }

        Animal animal = modelMapper.map(dto, Animal.class);
        animal.setReportedBy(getLoggedCustomer());
        animal.setStatus(AnimalStatus.REPORTED);

        try {
            if (photo != null && !photo.isEmpty()) {
                animal.setPhoto(fileService.saveFile(photo));
            }
        } catch (IOException e) {
            throw new RuntimeException("Photo upload failed");
        }

        Animal saved = animalRepository.save(animal);

        AnimalDTO response = modelMapper.map(saved, AnimalDTO.class);
        response.setReportedByCustomerId(
                saved.getReportedBy() != null
                        ? saved.getReportedBy().getId()
                        : null
        );
        return response;
    }

    // ALL ROLES
    @Override
    public List<AnimalDTO> getAllAnimals() {

        return animalRepository.findAll()
                .stream()
                .map(a -> {
                    System.out.println("ENTITY PHOTO 👉 " + a.getPhoto());
                    AnimalDTO dto = modelMapper.map(a, AnimalDTO.class);
                    System.out.println("DTO PHOTO 👉 " + dto.getPhoto());
                    return dto;
                })
                .toList();
    }

    // ALL ROLES
    @Override
    public AnimalDTO getAnimalById(Long id) {

        Animal animal = animalRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Animal not found"));

        AnimalDTO dto = modelMapper.map(animal, AnimalDTO.class);
        dto.setReportedByCustomerId(
                animal.getReportedBy() != null
                        ? animal.getReportedBy().getId()
                        : null
        );
        return dto;
    }

    // ADMIN
    @Override
    public AnimalDTO updateAnimal(Long id, AnimalDTO dto, MultipartFile photo) {

        if (!hasRole("ADMIN")) {
            throw new UnauthorizedActionException(
                    "Only admin can update animals");
        }

        Animal animal = animalRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Animal not found"));

        modelMapper.map(dto, animal);

        try {
            if (photo != null && !photo.isEmpty()) {
                animal.setPhoto(fileService.saveFile(photo));
            }
        } catch (IOException e) {
            throw new RuntimeException("Photo upload failed");
        }

        Animal updated = animalRepository.save(animal);

        AnimalDTO response = modelMapper.map(updated, AnimalDTO.class);
        response.setReportedByCustomerId(
                updated.getReportedBy() != null
                        ? updated.getReportedBy().getId()
                        : null
        );
        return response;
    }

    // ADMIN
    @Override
    @Transactional
    public void deleteAnimal(Long id) {

        if (!hasRole("ADMIN")) {
            throw new UnauthorizedActionException(
                    "Only admin can delete animals");
        }

        Animal animal = animalRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Animal not found"));

        // 🔥 STEP 1: delete dependent adoptions FIRST
        adoptionRepository.deleteByAnimalId(id);

        // 🔥 STEP 2: delete animal
        animalRepository.delete(animal);
    }

    
    
    //ADMIN
    @Override
    @Transactional
    public void updateStatusOnly(Long id, AnimalStatus status) {

        Animal animal = animalRepository.findById(id)
                .orElseThrow(() ->
                    new RuntimeException("Animal not found with id " + id));

        animal.setStatus(status);

        animalRepository.save(animal);
    }

}
