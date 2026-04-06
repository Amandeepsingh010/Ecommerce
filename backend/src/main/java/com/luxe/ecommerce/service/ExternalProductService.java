package com.luxe.ecommerce.service;

import com.luxe.ecommerce.model.Product;
import com.luxe.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExternalProductService {
    
    private final RestTemplate restTemplate;
    private final ProductRepository productRepository;
    
    @Value("${app.product-api.url}")
    private String externalApiUrl;
    
    // Fetch products from FakeStoreAPI
    public List<Product> fetchAndSaveProducts() {
        try {
            // Fetch products from external API
            List<Map<String, Object>> externalProducts = restTemplate.getForObject(
                externalApiUrl, List.class);
            
            List<Product> savedProducts = new ArrayList<>();
            
            if (externalProducts != null) {
                for (Map<String, Object> extProduct : externalProducts) {
                    // Check if product already exists
                    String externalId = String.valueOf(extProduct.get("id"));
                    boolean exists = productRepository.findAll().stream()
                        .anyMatch(p -> externalId.equals(p.getExternalId()));
                    
                    if (!exists) {
                        Product product = Product.builder()
                            .externalId(externalId)
                            .name((String) extProduct.get("title"))
                            .description((String) extProduct.get("description"))
                            .category((String) extProduct.get("category"))
                            .price(BigDecimal.valueOf((Double) extProduct.get("price")))
                            .imageUrl((String) extProduct.get("image"))
                            .rating(4.5)
                            .reviewCount(0)
                            .stockQuantity(100)
                            .build();
                        
                        savedProducts.add(productRepository.save(product));
                    }
                }
            }
            
            return savedProducts;
        } catch (Exception e) {
            System.err.println("Error fetching external products: " + e.getMessage());
            return new ArrayList<>();
        }
    }
}