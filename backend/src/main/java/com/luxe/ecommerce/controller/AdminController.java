// package com.luxe.ecommerce.controller;

// import com.luxe.ecommerce.dto.AuthDTOs.ApiResponse;
// import com.luxe.ecommerce.model.Order;
// import com.luxe.ecommerce.model.Product;
// import com.luxe.ecommerce.model.User;
// import com.luxe.ecommerce.repository.OrderRepository;
// import com.luxe.ecommerce.repository.ProductRepository;
// import com.luxe.ecommerce.repository.UserRepository;
// import lombok.RequiredArgsConstructor;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.prepost.PreAuthorize;
// import org.springframework.web.bind.annotation.*;

// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;

// @RestController
// @RequestMapping("/api/admin")
// @RequiredArgsConstructor
// @PreAuthorize("hasRole('ADMIN')")
// @CrossOrigin(origins = "*")
// public class AdminController {
    
//     private final UserRepository userRepository;
//     private final ProductRepository productRepository;
//     private final OrderRepository orderRepository;
    
//     // Dashboard statistics
//     @GetMapping("/dashboard/stats")
//     public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
//         Map<String, Object> stats = new HashMap<>();
        
//         stats.put("totalUsers", userRepository.count());
//         stats.put("totalProducts", productRepository.count());
//         stats.put("totalOrders", orderRepository.count());
//         stats.put("pendingOrders", orderRepository.countByStatus(OrderStatus.PENDING));
//         stats.put("deliveredOrders", orderRepository.countByStatus(OrderStatus.DELIVERED));
        
//         // Calculate total revenue (simplified)
//         // stats.put("totalRevenue", orderRepository.getTotalRevenue());
        
//         return ResponseEntity.ok(ApiResponse.success(stats, "Dashboard stats fetched"));
//     }
    
//     // Get all users (admin only)
//     @GetMapping("/users")
//     public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
//         List<User> users = userRepository.findAll();
//         return ResponseEntity.ok(ApiResponse.success(users, "Users fetched"));
//     }
    
//     // Update user role
//     @PutMapping("/users/{userId}/role")
//     public ResponseEntity<ApiResponse<User>> updateUserRole(
//             @PathVariable Long userId,
//             @RequestParam String role) {
        
//         User user = userRepository.findById(userId)
//             .orElseThrow(() -> new RuntimeException("User not found"));
        
//         user.setRole(Role.valueOf(role.toUpperCase()));
//         userRepository.save(user);
        
//         return ResponseEntity.ok(ApiResponse.success(user, "User role updated"));
//     }
    
//     // Create product (admin only)
//     @PostMapping("/products")
//     public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product product) {
//         Product savedProduct = productRepository.save(product);
//         return ResponseEntity.ok(ApiResponse.success(savedProduct, "Product created"));
//     }
    
//     // Update product
//     @PutMapping("/products/{productId}")
//     public ResponseEntity<ApiResponse<Product>> updateProduct(
//             @PathVariable Long productId,
//             @RequestBody Product product) {
        
//         Product existingProduct = productRepository.findById(productId)
//             .orElseThrow(() -> new RuntimeException("Product not found"));
        
//         existingProduct.setName(product.getName());
//         existingProduct.setPrice(product.getPrice());
//         existingProduct.setStockQuantity(product.getStockQuantity());
//         existingProduct.setActive(product.isActive());
        
//         productRepository.save(existingProduct);
        
//         return ResponseEntity.ok(ApiResponse.success(existingProduct, "Product updated"));
//     }
    
//     // Delete product
//     @DeleteMapping("/products/{productId}")
//     public ResponseEntity<ApiResponse<?>> deleteProduct(@PathVariable Long productId) {
//         productRepository.deleteById(productId);
//         return ResponseEntity.ok(ApiResponse.success(null, "Product deleted"));
//     }
    
//     // Get all orders (admin)
//     @GetMapping("/orders")
//     public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
//         List<Order> orders = orderRepository.findAll();
//         return ResponseEntity.ok(ApiResponse.success(orders, "All orders fetched"));
//     }
    
//     // Update order status
//     @PutMapping("/orders/{orderId}/status")
//     public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
//             @PathVariable Long orderId,
//             @RequestParam String status) {
        
//         Order order = orderRepository.findById(orderId)
//             .orElseThrow(() -> new RuntimeException("Order not found"));
        
//         order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
//         orderRepository.save(order);
        
//         return ResponseEntity.ok(ApiResponse.success(order, "Order status updated"));
//     }
// }