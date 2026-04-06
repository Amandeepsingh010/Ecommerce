package com.luxe.ecommerce.controller;

import com.luxe.ecommerce.dto.AuthDTOs.*;
import com.luxe.ecommerce.model.User;
import com.luxe.ecommerce.repository.UserRepository;
import com.luxe.ecommerce.security.JwtService;
import com.luxe.ecommerce.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;
    
    // Generate random OTP
    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }
    
    // Register new user
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<?>> register(@Valid @RequestBody RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Email already registered"));
        }
        
        // Check if phone already exists
        if (request.getPhoneNumber() != null && userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Phone number already registered"));
        }
        
        // Create new user
        String otp = generateOtp();
        User user = User.builder()
            .fullName(request.getFullName())
            .email(request.getEmail())
            .phoneNumber(request.getPhoneNumber())
            .password(passwordEncoder.encode(request.getPassword()))
            .otp(otp)
            .otpExpiry(LocalDateTime.now().plusMinutes(10))
            .build();
        
        userRepository.save(user);
        
        // Send OTP email
        emailService.sendOtpEmail(request.getEmail(), otp);
        
        return ResponseEntity.ok(ApiResponse.success(null, 
            "Registration successful! Please verify your email with OTP sent to " + request.getEmail()));
    }
    
    // Verify OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<?>> verifyOtp(@Valid @RequestBody OtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.isEmailVerified()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Email already verified"));
        }
        
        if (user.getOtp() == null || !user.getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Invalid OTP"));
        }
        
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("OTP has expired. Please request a new one"));
        }
        
        // Verify user
        user.setEmailVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        
        // Generate tokens
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        String accessToken = jwtService.generateToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        // Save refresh token
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        
        AuthResponse response = AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole().name())
            .build();
        
        return ResponseEntity.ok(ApiResponse.success(response, "Email verified successfully"));
    }
    
    // Login
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<?>> login(@Valid @RequestBody LoginRequest request) {
        // Check if user exists and is verified
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        if (!user.isEmailVerified()) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Please verify your email first"));
        }
        
        // Authenticate
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        // Generate tokens
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());
        String accessToken = jwtService.generateToken(claims, user);
        String refreshToken = jwtService.generateRefreshToken(user);
        
        // Save refresh token
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        
        AuthResponse response = AuthResponse.builder()
            .accessToken(accessToken)
            .refreshToken(refreshToken)
            .email(user.getEmail())
            .fullName(user.getFullName())
            .role(user.getRole().name())
            .build();
        
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }
    
    // Forgot password - send reset OTP
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<?>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        String resetOtp = generateOtp();
        user.setOtp(resetOtp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);
        
        emailService.sendPasswordResetEmail(request.getEmail(), resetOtp);
        
        return ResponseEntity.ok(ApiResponse.success(null, 
            "Password reset OTP sent to " + request.getEmail()));
    }
    
    // Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<?>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        User user = userRepository.findAll().stream()
            .filter(u -> request.getToken().equals(u.getOtp()))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Invalid reset token"));
        
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Reset token has expired"));
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
        
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successful"));
    }
    
    // Refresh token
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<?>> refreshToken(@RequestHeader("Authorization") String refreshToken) {
        if (refreshToken != null && refreshToken.startsWith("Bearer ")) {
            refreshToken = refreshToken.substring(7);
            
            // Find user with this refresh token
            User user = userRepository.findAll().stream()
                .filter(u -> refreshToken.equals(u.getRefreshToken()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
            
            // Validate token
            if (jwtService.isTokenValid(refreshToken, user)) {
                Map<String, Object> claims = new HashMap<>();
                claims.put("role", user.getRole().name());
                String newAccessToken = jwtService.generateToken(claims, user);
                
                return ResponseEntity.ok(ApiResponse.success(
                    Map.of("accessToken", newAccessToken), 
                    "Token refreshed successfully"));
            }
        }
        
        return ResponseEntity.badRequest()
            .body(ApiResponse.error("Invalid refresh token"));
    }
    
    // Logout
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<?>> logout(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String email = jwtService.extractUsername(token.substring(7));
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                user.setRefreshToken(null);
                userRepository.save(user);
            }
        }
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }
}