package com.arc.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.json.JSONObject;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.arc.config.RazorpayConfig;
import com.arc.dto.CreateOrderRequest;
import com.arc.dto.CreateOrderResponse;
import com.arc.dto.PaymentDTO;
import com.arc.dto.VerifyPaymentRequest;
import com.arc.entities.Payment;
import com.arc.entities.PaymentStatus;
import com.arc.entities.User;
import com.arc.exceptions.ResourceNotFoundException;
import com.arc.exceptions.UnauthorizedActionException;
import com.arc.repositories.PaymentRepository;
import com.arc.repositories.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;
    private final ModelMapper modelMapper;

    // ================= AUTH HELPERS =================

    private User getAuthenticatedUser() {

        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new UnauthorizedActionException("User not authenticated");
        }

        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found"));
    }

    private void validateDonor(User user) {
        if (user.getDonor() == null) {
            throw new UnauthorizedActionException(
                    "Only donors are allowed to make payments");
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
        	JSONObject options = new JSONObject();
        	options.put(
        	    "amount",
        	    dto.getAmount().multiply(BigDecimal.valueOf(100)).intValue()
        	);
        	options.put("currency", "INR");
        	options.put("receipt", "rcpt_" + System.currentTimeMillis());


        	Order order = razorpayClient.orders.create(options);
        	
            Payment payment = new Payment();
            payment.setReferenceId(dto.getReferenceId());
            payment.setPaymentType(dto.getPaymentType());
            payment.setAmount(dto.getAmount());
            payment.setTransactionId(order.get("id"));
            payment.setStatus(PaymentStatus.CREATED);
            payment.setPaymentDate(LocalDateTime.now());

            paymentRepository.save(payment);

            return new CreateOrderResponse(
                    order.get("id"),
                    dto.getAmount(),
                    razorpayConfig.getKeyId()
            );

        } catch (Exception e) {
        	 e.printStackTrace();
            throw new RuntimeException("Razorpay order creation failed", e);
        }
    }

    // ================= VERIFY PAYMENT =================

    @Override
    public void verifyPayment(VerifyPaymentRequest dto) {

        User user = getAuthenticatedUser();
        validateDonor(user);

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", dto.getRazorpay_order_id());
            options.put("razorpay_payment_id", dto.getRazorpay_payment_id());
            options.put("razorpay_signature", dto.getRazorpay_signature());

            boolean isValid = Utils.verifyPaymentSignature(
                    options,
                    razorpayConfig.getKeySecret()
            );

            Payment payment = paymentRepository
                    .findByTransactionId(dto.getRazorpay_order_id())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Payment not found"));

            payment.setStatus(
                    isValid ? PaymentStatus.SUCCESS : PaymentStatus.FAILED
            );

            paymentRepository.save(payment);

        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed", e);
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
