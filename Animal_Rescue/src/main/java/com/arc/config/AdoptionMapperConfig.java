package com.arc.config;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Configuration;

import com.arc.dto.AdoptionDTO;
import com.arc.entities.Adoption;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class AdoptionMapperConfig {

    private final ModelMapper modelMapper;

    @PostConstruct
    public void configureAdoptionMapping() {

        modelMapper.typeMap(Adoption.class, AdoptionDTO.class)
            .addMappings(mapper -> {

                mapper.map(Adoption::getId, AdoptionDTO::setId);
                mapper.map(Adoption::getStatus, AdoptionDTO::setStatus);
                mapper.map(Adoption::getAdoptionDate, AdoptionDTO::setAdoptionDate);

                mapper.map(src -> src.getAnimal().getId(),
                           AdoptionDTO::setAnimalId);

                mapper.map(src -> src.getAnimal().getName(),
                           AdoptionDTO::setAnimalName);

                mapper.map(src -> src.getAnimal().getCategory(),
                           AdoptionDTO::setAnimalCategory);

                mapper.map(src -> src.getAnimal().getPhoto(),
                           AdoptionDTO::setAnimalPhoto);
            });
    }

}
