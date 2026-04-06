package com.luxe.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String externalId; // ID from external API
    
    @Column(nullable = false)
    private String name;
    
    private String brand;
    
    @Column(length = 2000)
    private String description;
    
    private BigDecimal price;
    
    private BigDecimal oldPrice;
    
    private String category;
    
    private String imageUrl;
    
    private String emoji;
    
    private Double rating;
    
    private Integer reviewCount;
    
    private Integer stockQuantity;
    
    private boolean active = true;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (rating == null) rating = 4.5;
        if (reviewCount == null) reviewCount = 0;
        if (stockQuantity == null) stockQuantity = 100;
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}