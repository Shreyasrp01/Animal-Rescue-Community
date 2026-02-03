package com.arc.services;


import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.arc.dto.ChangePassword;
import com.arc.entities.ForgotPassword;
import com.arc.entities.User;
import com.arc.exceptions.EmailSendingException;
import com.arc.exceptions.InvalidPasswordException;
import com.arc.exceptions.OTPInvalidException;
import com.arc.exceptions.UserNotFoundException;
import com.arc.repositories.ForgotPasswordRepository;
import com.arc.repositories.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

	@Value("${spring.mail.username}")
	private String fromEmailId;

	private final JavaMailSender javaMailSender;
	private final TemplateEngine templateEngine;
	private final UserRepository userRepository;
	private final ForgotPasswordRepository forgotPasswordRepository;
	private final PasswordEncoder encoder;

	@Transactional
	@Override
	public void sendVerifyEmail(String email) {

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new UserNotFoundException("User not found"));

	    // delete old OTP if exists
	    forgotPasswordRepository.deleteByUser(user);
	    forgotPasswordRepository.flush();   


	    Integer otp = otpGenerator();

	    ForgotPassword fp = ForgotPassword.builder()
	            .otp(otp)
	            .expirationTime(new Date(System.currentTimeMillis() + 10 * 60 * 1000))
	            .user(user)
	            .verified(false)
	            .build();

	    Context context = new Context();
	    context.setVariable("otp", otp);
	    context.setVariable("name", user.getName());

	    String body = templateEngine.process("email-template", context);

	    try {
	        MimeMessage message = javaMailSender.createMimeMessage();
	        MimeMessageHelper helper = new MimeMessageHelper(message, true);

	        helper.setFrom(fromEmailId);
	        helper.setTo(email);
	        helper.setSubject("ARC Password Reset OTP");
	        helper.setText(body, true);

	        javaMailSender.send(message);

	        forgotPasswordRepository.save(fp);

	    } catch (MessagingException e) {
	        throw new EmailSendingException("Failed to send OTP email");
	    }
	}


	private Integer otpGenerator() {
		Random random = new Random();
		int randomNumber = 100000 + random.nextInt(900000);
		return randomNumber;
	}

	@Transactional
	@Override
	public void verifyOTP(Integer otp, String email) {

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new UserNotFoundException("User not found"));

	    ForgotPassword fp = forgotPasswordRepository.findByUser(user)
	            .orElseThrow(() -> new OTPInvalidException("OTP not requested"));

	    if (fp.getExpirationTime().before(new Date())) {
	        forgotPasswordRepository.delete(fp);
	        throw new OTPInvalidException("OTP expired");
	    }

	    if (!fp.getOtp().equals(otp)) {
	        throw new OTPInvalidException("Invalid OTP");
	    }

	    fp.setVerified(true);
	    forgotPasswordRepository.save(fp);
	}

	@Transactional
	@Override
	public void changePassword(String email, ChangePassword changePassword) {

	    if (!changePassword.password().equals(changePassword.rePassword())) {
	        throw new InvalidPasswordException("Passwords do not match");
	    }

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new UserNotFoundException("User not found"));

	    ForgotPassword fp = forgotPasswordRepository.findByUser(user)
	            .orElseThrow(() -> new OTPInvalidException("OTP not verified"));

	    if (!fp.getVerified()) {
	        throw new OTPInvalidException("OTP verification required");
	    }

	    userRepository.updatePassword(
	            email,
	            encoder.encode(changePassword.password())
	    );

	    // cleanup OTP
	    forgotPasswordRepository.delete(fp);
	}


}