package com.arc.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.arc.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {

  
    
    @Modifying
    @Query("UPDATE User u SET u.password = :password WHERE u.email = :email")
    void updatePassword(@Param("email") String email,
                        @Param("password") String password);
    

    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);

}
