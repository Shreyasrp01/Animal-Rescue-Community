package com.arc.payment.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.arc.payment.config.RazorpayConfig;
import com.arc.payment.dto.CreateOrderRequest;
import com.arc.payment.dto.CreateOrderResponse;
import com.arc.payment.dto.VerifyPaymentRequest;
import com.arc.payment.entities.Payment;
import com.arc.payment.entities.PaymentStatus;
import com.arc.payment.repositories.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;
    private final RazorpayConfig razorpayConfig;

    @Override
    public CreateOrderResponse createOrder(CreateOrderRequest dto) {

        try {
            JSONObject options = new JSONObject();
            options.put("amount", dto.getAmount().multiply(BigDecimal.valueOf(100)).intValue());
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

    @Override
    public void verifyPayment(VerifyPaymentRequest dto) {

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
                    .orElseThrow(() -> new RuntimeException("Payment not found"));

            payment.setStatus(isValid ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);

            paymentRepository.save(payment);

        } catch (Exception e) {
            throw new RuntimeException("Payment verification failed", e);
        }
    }
}
