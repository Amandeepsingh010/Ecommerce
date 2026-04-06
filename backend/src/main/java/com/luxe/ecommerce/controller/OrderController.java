// package com.luxe.ecommerce.controller;

// import com.luxe.ecommerce.dto.AuthDTOs.ApiResponse;
// import com.luxe.ecommerce.model.Order;
// import com.luxe.ecommerce.model.User;
// import com.luxe.ecommerce.repository.OrderRepository;
// import com.luxe.ecommerce.repository.UserRepository;
// import com.luxe.ecommerce.service.EmailService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.data.domain.Page;
// import org.springframework.data.domain.PageRequest;
// import org.springframework.data.domain.Pageable;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.web.bind.annotation.*;

// import java.util.Map;

// @RestController
// @RequestMapping("/api/orders")
// @RequiredArgsConstructor
// @CrossOrigin(origins = "*")
// public class OrderController {
    
//     private final OrderRepository orderRepository;
//     private final UserRepository userRepository;
//     private final EmailService emailService;
    
//     // Get current user's orders
//     @GetMapping("/my-orders")
//     public ResponseEntity<ApiResponse<Page<Order>>> getMyOrders(
//             @RequestParam(defaultValue = "0") int page,
//             @RequestParam(defaultValue = "10") int size) {
        
//         String email = SecurityContextHolder.getContext().getAuthentication().getName();
//         User user = userRepository.findByEmail(email)
//             .orElseThrow(() -> new RuntimeException("User not found"));
        
//         Pageable pageable = PageRequest.of(page, size);
//         Page<Order> orders = orderRepository.findByUser(user, pageable);
        
//         return ResponseEntity.ok(ApiResponse.success(orders, "Orders fetched"));
//     }
    
//     // Create new order
//     @PostMapping("/create")
//     public ResponseEntity<ApiResponse<Order>> createOrder(@RequestBody Map<String, Object> orderData) {
//         String email = SecurityContextHolder.getContext().getAuthentication().getName();
//         User user = userRepository.findByEmail(email)
//             .orElseThrow(() -> new RuntimeException("User not found"));
        
//         // TODO: Implement order creation logic
//         // This would include validating cart items, calculating total, etc.
        
//         // Send email confirmation
//         // emailService.sendOrderConfirmation(email, orderNumber, totalAmount);
        
//         return ResponseEntity.ok(ApiResponse.success(null, "Order created successfully"));
//     }
    
//     // Get order by ID
//     @GetMapping("/{orderId}")
//     public ResponseEntity<ApiResponse<Order>> getOrder(@PathVariable Long orderId) {
//         Order order = orderRepository.findById(orderId)
//             .orElseThrow(() -> new RuntimeException("Order not found"));
        
//         // Check if user owns this order or is admin
//         String email = SecurityContextHolder.getContext().getAuthentication().getName();
//         if (!order.getUser().getEmail().equals(email) && 
//             !SecurityContextHolder.getContext().getAuthentication().getAuthorities()
//                 .stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
//             return ResponseEntity.status(403)
//                 .body(ApiResponse.error("Unauthorized to view this order"));
//         }
        
//         return ResponseEntity.ok(ApiResponse.success(order, "Order fetched"));
//     }
    
//     // Cancel order
//     @PutMapping("/{orderId}/cancel")
//     public ResponseEntity<ApiResponse<?>> cancelOrder(@PathVariable Long orderId) {
//         Order order = orderRepository.findById(orderId)
//             .orElseThrow(() -> new RuntimeException("Order not found"));
        
//         // TODO: Implement cancellation logic with status check
        
//         return ResponseEntity.ok(ApiResponse.success(null, "Order cancelled"));
//     }
// }