package com.arc.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.arc.entities.Adoption;
import com.arc.entities.Status;

import jakarta.transaction.Transactional;

public interface AdoptionRepository extends JpaRepository<Adoption, Long> {
	@Query("""
		    SELECT a
		    FROM Adoption a
		    JOIN FETCH a.animal
		    WHERE a.customer.id = :customerId
		""")
		List<Adoption> findByCustomerId(Long customerId);
	
	@Query("""
			SELECT a FROM Adoption a
			JOIN FETCH a.animal
			JOIN FETCH a.customer c
			JOIN FETCH c.user
			""")
		    List<Adoption> findAllWithDetails();
    
	 @Modifying
	    @Transactional
	    @Query("DELETE FROM Adoption a WHERE a.animal.id = :animalId")
	    void deleteByAnimalId(@Param("animalId") Long animalId);

	    boolean existsByAnimalId(Long animalId);

	    
	    @Modifying
	    @Transactional
	    @Query("DELETE FROM Adoption a WHERE a.customer.id = :customerId")
	    void deleteByCustomerId(@Param("customerId") Long customerId);

	    boolean existsByCustomer_IdAndAnimal_IdAndStatusIn(
	            Long customerId,
	            Long animalId,
	            List<Status> statuses
	    );
}
