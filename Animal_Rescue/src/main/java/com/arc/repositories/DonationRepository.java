package com.arc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.arc.entities.Donation;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByDonorId(Long donorId);
}
