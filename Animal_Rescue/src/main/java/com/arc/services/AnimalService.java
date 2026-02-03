package com.arc.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.arc.dto.AnimalDTO;
import com.arc.entities.AnimalStatus;

public interface AnimalService {

    AnimalDTO reportAnimal(AnimalDTO dto, MultipartFile photo);

    List<AnimalDTO> getAllAnimals();

    AnimalDTO getAnimalById(Long id);

    AnimalDTO updateAnimal(Long id, AnimalDTO dto, MultipartFile photo);

    void deleteAnimal(Long id);
    
    void updateStatusOnly(Long id, AnimalStatus status);


}
