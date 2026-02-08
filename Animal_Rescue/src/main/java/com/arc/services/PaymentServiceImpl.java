package com.arc.services;

import java.math.BigDecimal;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.arc.dto.CreateOrderRequest;
import com.arc.dto.CreateOrderResponse;
import com.arc.dto.PaymentDTO;
import com.arc.dto.VerifyPaymentRequest;
import com.arc.entities.User;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.exceptions.UnauthorizedActionException;
import com.arc.repositories.PaymentRepository;
import com.arc.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    // ================= AUTH HELPERS =================

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedActionException("User not authenticated");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void validateDonor(User user) {
        if (user.getDonor() == null) {
            throw new UnauthorizedActionException("Only donors are allowed to make payments");
        }
    }

    // ================= CREATE ORDER =================

    @Override
    public CreateOrderResponse createOrder(CreateOrderRequest dto) {

        User user = getAuthenticatedUser();
        validateDonor(user);

        // -------- VALIDATION --------
        if (dto.getAmount() == null || dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }

        if (dto.getPaymentType() == null) {
            throw new IllegalArgumentException("Payment type is required");
        }

        if (dto.getReferenceId() == null) {
            throw new IllegalArgumentException("Reference ID is required");
        }

        try {
            // Call Microservice
            String url = "http://localhost:8081/api/payments/create-order";
            RestTemplate restTemplate = new RestTemplate();
            
            return restTemplate.postForObject(url, dto, CreateOrderResponse.class);

        } catch (Exception e) {
             e.printStackTrace();
            throw new RuntimeException("Microservice order creation failed: " + e.getMessage());
        }
    }

    // ================= VERIFY PAYMENT =================

    @Override
    public void verifyPayment(VerifyPaymentRequest dto) {

        User user = getAuthenticatedUser();
        validateDonor(user);

        try {
             // Call Microservice
            String url = "http://localhost:8081/api/payments/verify";
            RestTemplate restTemplate = new RestTemplate();

            restTemplate.postForObject(url, dto, Void.class);

        } catch (Exception e) {
            throw new RuntimeException("Microservice payment verification failed: " + e.getMessage());
        }
    }

    // ================= PAYMENT HISTORY =================

    @Override
    public List<PaymentDTO> getMyPayments() {

        User user = getAuthenticatedUser();
        validateDonor(user);

        return paymentRepository.findAll()
                .stream()
                .map(payment -> modelMapper.map(payment, PaymentDTO.class))
                .toList();
    }
}
