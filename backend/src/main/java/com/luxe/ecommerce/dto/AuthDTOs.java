package com.luxe.ecommerce.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDTOs {
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        @NotBlank @Email
        private String email;
        
        @NotBlank
        private String password;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RegisterRequest {
        @NotBlank
        private String fullName;
        
        @NotBlank @Email
        private String email;
        
        @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
        private String phoneNumber;
        
        @NotBlank @Size(min = 6, message = "Password must be at least 6 characters")
        private String password;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OtpRequest {
        @NotBlank @Email
        private String email;
        
        @NotBlank @Pattern(regexp = "^[0-9]{6}$")
        private String otp;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ForgotPasswordRequest {
        @NotBlank @Email
        private String email;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResetPasswordRequest {
        @NotBlank
        private String token;
        
        @NotBlank @Size(min = 6)
        private String newPassword;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String accessToken;
        private String refreshToken;
        private String email;
        private String fullName;
        private String role;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApiResponse<T> {
        private boolean success;
        private String message;
        private T data;
        
        public static <T> ApiResponse<T> success(T data, String message) {
            return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .build();
        }
        
        public static <T> ApiResponse<T> error(String message) {
            return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .build();
        }
    }
}