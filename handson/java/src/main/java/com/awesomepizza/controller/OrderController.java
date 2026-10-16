package com.awesomepizza.controller;

import com.awesomepizza.database.InMemoryDatabase;
import com.awesomepizza.dto.CreateOrderRequest;
import com.awesomepizza.dto.UpdateOrderRequest;
import com.awesomepizza.model.Order;
import com.awesomepizza.model.OrderItem;
import com.awesomepizza.model.OrderStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final InMemoryDatabase database;

    public OrderController(InMemoryDatabase database) {
        this.database = database;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getOrder(@PathVariable String id) {
        try {
            Optional<Order> order = database.findOrderById(id);
            if (order.isEmpty()) {
                return errorResponse(HttpStatus.NOT_FOUND, "Not found", "Order with ID '" + id + "' not found");
            }
            return successResponse(HttpStatus.OK, order.get(), "Order retrieved successfully");
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", "Failed to retrieve order");
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            String sender = request.getSender();
            if (sender == null || sender.trim().isEmpty()) {
                return errorResponse(HttpStatus.BAD_REQUEST, "Bad request", "Order sender is required and must be a non-empty string");
            }

            List<OrderItem> contents = request.getContents();
            if (contents == null || contents.isEmpty()) {
                return errorResponse(HttpStatus.BAD_REQUEST, "Bad request", "Order contents are required and must be a non-empty array");
            }

            String itemError = validateItems(contents);
            if (itemError != null) {
                return errorResponse(HttpStatus.BAD_REQUEST, "Bad request", itemError);
            }

            Order newOrder = database.addOrder(sender.trim(), contents);
            return successResponse(HttpStatus.CREATED, newOrder, "Order created successfully");
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", "Failed to create order");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateOrder(@PathVariable String id, @RequestBody UpdateOrderRequest request) {
        try {
            Optional<Order> existing = database.findOrderById(id);
            if (existing.isEmpty()) {
                return errorResponse(HttpStatus.NOT_FOUND, "Not found", "Order with ID '" + id + "' not found");
            }

            Order order = existing.get();

            if (request.getSender() != null) {
                if (request.getSender().trim().isEmpty()) {
                    return errorResponse(HttpStatus.BAD_REQUEST, "Bad request", "Order sender must be a non-empty string");
                }
                order.setSender(request.getSender().trim());
            }

            if (request.getStatus() != null) {
                OrderStatus status;
                try {
                    status = OrderStatus.valueOf(request.getStatus());
                } catch (IllegalArgumentException e) {
                    String valid = Arrays.stream(OrderStatus.values()).map(Enum::name).collect(Collectors.joining(", "));
                    return errorResponse(HttpStatus.BAD_REQUEST, "Bad request", "Status must be one of: " + valid);
                }
                order.setStatus(status);
            }

            if (request.getContents() != null) {
                if (request.getContents().isEmpty()) {
                    return errorResponse(HttpStatus.BAD_REQUEST, "Bad request", "Order contents must be a non-empty array");
                }
                String itemError = validateItems(request.getContents());
                if (itemError != null) {
                    return errorResponse(HttpStatus.BAD_REQUEST, "Bad request", itemError);
                }
                order.setContents(request.getContents());
            }

            return successResponse(HttpStatus.OK, order, "Order updated successfully");
        } catch (Exception e) {
            return errorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error", "Failed to update order");
        }
    }

    private String validateItems(List<OrderItem> items) {
        for (OrderItem item : items) {
            if (item.getName() == null || item.getName().trim().isEmpty()) {
                return "Each order item must have a valid name";
            }
            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                return "Each order item must have a valid quantity (positive number)";
            }
        }
        return null;
    }

    private ResponseEntity<Map<String, Object>> successResponse(HttpStatus status, Object data, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("data", data);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }

    private ResponseEntity<Map<String, Object>> errorResponse(HttpStatus status, String error, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", false);
        body.put("error", error);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
