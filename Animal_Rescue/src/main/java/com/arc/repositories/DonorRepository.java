package com.arc.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arc.entities.Donor;

public interface DonorRepository extends JpaRepository<Donor, Long> {
}
