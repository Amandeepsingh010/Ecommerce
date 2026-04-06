package com.luxe.ecommerce.controller;

import com.luxe.ecommerce.dto.AuthDTOs.ApiResponse;
import com.luxe.ecommerce.model.Product;
import com.luxe.ecommerce.repository.ProductRepository;
import com.luxe.ecommerce.service.ExternalProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    
    private final ProductRepository productRepository;
    private final ExternalProductService externalProductService;
    
    // Get all products with pagination
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Product> products = productRepository.findAll(pageable);
        
        return ResponseEntity.ok(ApiResponse.success(products, "Products fetched successfully"));
    }
    
    // Get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<Page<Product>>> getProductsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByCategory(category, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(products, "Products fetched by category"));
    }
    
    // Search products
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<Product>>> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.searchProducts(keyword, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(products, "Search results"));
    }
    
    // Filter by price range
    @GetMapping("/filter/price")
    public ResponseEntity<ApiResponse<Page<Product>>> filterByPrice(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Product> products = productRepository.findByPriceRange(minPrice, maxPrice, pageable);
        
        return ResponseEntity.ok(ApiResponse.success(products, "Products filtered by price"));
    }
    
    // Get top rated products
    @GetMapping("/top-rated")
    public ResponseEntity<ApiResponse<List<Product>>> getTopRated() {
        List<Product> products = productRepository.findTop10ByOrderByRatingDesc();
        return ResponseEntity.ok(ApiResponse.success(products, "Top rated products"));
    }
    
    // Get single product
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return ResponseEntity.ok(ApiResponse.success(product, "Product fetched"));
    }
    
    // Sync products from external API (FakeStoreAPI)
    @PostMapping("/sync-external")
    public ResponseEntity<ApiResponse<?>> syncExternalProducts() {
        List<Product> syncedProducts = externalProductService.fetchAndSaveProducts();
        return ResponseEntity.ok(ApiResponse.success(
            Map.of("count", syncedProducts.size()),
            "Products synced from external API"));
    }
    
    // Public endpoint - no auth required
    @GetMapping("/public/featured")
    public ResponseEntity<ApiResponse<List<Product>>> getFeaturedProducts() {
        List<Product> products = productRepository.findAll(PageRequest.of(0, 8)).getContent();
        return ResponseEntity.ok(ApiResponse.success(products, "Featured products"));
    }
}