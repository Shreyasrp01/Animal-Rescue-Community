package com.arc.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.arc.dto.AuthResponseDTO;
import com.arc.dto.LoginDTO;
import com.arc.dto.UserDTO;
import com.arc.entities.Customer;
import com.arc.entities.Donor;
import com.arc.entities.Role;
import com.arc.entities.User;
import com.arc.exceptions.BadRequestException;
import com.arc.repositories.UserRepository;
import com.arc.security.JwtService;
import com.arc.services.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    // ================= SIGNUP =================
    @Override
    public void signup(UserDTO dto) {

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BadRequestException("Email already registered");
        }

        if (dto.getRole() == Role.ADMIN) {
            throw new BadRequestException("Admin signup not allowed");
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());
        user.setAddress(dto.getAddress());
        user.setRole(dto.getRole());

        // create child entity based on role
        if (dto.getRole() == Role.CUSTOMER) {
            Customer customer = new Customer();
            customer.setUser(user);
            user.setCustomer(customer);
        }

        if (dto.getRole() == Role.DONOR) {
            Donor donor = new Donor();
            donor.setUser(user);
            user.setDonor(donor);
        }

        userRepository.save(user);
    }

    // ================= LOGIN =================
    @Override
    public AuthResponseDTO login(LoginDTO dto) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                dto.getEmail(),
                                dto.getPassword()
                        )
                );

        UserDetails userDetails =
                (UserDetails) authentication.getPrincipal();

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() ->
                        new BadRequestException("Invalid credentials"));

        String token = jwtService.generateToken(userDetails);

        return new AuthResponseDTO(
                token,
                user.getName(),     
                user.getEmail(),
                user.getRole()
        );
    }

    // ================= LOGOUT =================
    @Override
    public void logout() {
        // JWT is stateless → frontend deletes token
    }
}
