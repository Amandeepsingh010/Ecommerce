package com.luxe.ecommerce.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Async
    public void sendOtpEmail(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("LUXE - Your OTP Verification Code");
        message.setText(String.format(
            "Welcome to LUXE!\n\nYour OTP for email verification is: %s\n\nThis OTP is valid for 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\n- LUXE Team",
            otp
        ));
        mailSender.send(message);
    }
    
    @Async
    public void sendPasswordResetEmail(String to, String resetToken) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("LUXE - Password Reset Request");
        message.setText(String.format(
            "We received a request to reset your password.\n\nYour password reset token: %s\n\nThis token is valid for 15 minutes.\n\nIf you didn't request this, please ignore this email.\n\n- LUXE Team",
            resetToken
        ));
        mailSender.send(message);
    }
    
    @Async
    public void sendOrderConfirmation(String to, String orderNumber, double amount) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("LUXE - Order Confirmation #" + orderNumber);
        message.setText(String.format(
            "Thank you for your order!\n\nOrder Number: %s\nTotal Amount: ₹%.2f\n\nYour order has been confirmed and will be processed soon.\n\nTrack your order in the LUXE app.\n\n- LUXE Team",
            orderNumber, amount
        ));
        mailSender.send(message);
    }
}