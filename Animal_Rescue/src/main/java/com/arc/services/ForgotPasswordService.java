package com.arc.services;

import com.arc.dto.ChangePassword;

public interface ForgotPasswordService {

    void sendVerifyEmail(String email);

    void verifyOTP(Integer otp, String email);

    void changePassword(String email, ChangePassword changePassword);
}
