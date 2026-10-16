package com.awesomepizza.controller;

import com.awesomepizza.dto.LoginRequest;
import com.awesomepizza.util.TokenUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    // Token payload: base64({"role":"admin"})
    private static final String HARDCODED_TOKEN = "eyJyb2xlIjoiYWRtaW4ifQ==";

    private static final List<LoginRequest> USERS = List.of(credentials("user", "pass"));

    private final ObjectMapper objectMapper;

    public AuthController(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    private static LoginRequest credentials(String username, String password) {
        LoginRequest user = new LoginRequest();
        user.setUsername(username);
        user.setPassword(password);
        return user;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request) {
        boolean match = USERS.stream().anyMatch(u ->
                u.getUsername().equals(request.getUsername()) && u.getPassword().equals(request.getPassword()));

        if (!match) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("success", false);
            body.put("error", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("token", HARDCODED_TOKEN);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/protected")
    public ResponseEntity<Map<String, Object>> getProtectedContent(HttpServletRequest request) {
        String token = TokenUtil.extractBearerToken(request);
        if (token == null || !token.equals(HARDCODED_TOKEN)) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("success", false);
            body.put("error", "Unauthorized");
            body.put("message", "Valid token required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("secretRecipes", List.of("Margherita Supreme", "Dragon Pepperoni", "Black Truffle Delight"));
        data.put("staffDiscount", "50% off all pizzas");
        data.put("vipCode", "PIZZA-VIP-2024");
        data.put("deliveryNote", "Drivers use entrance B");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("success", true);
        body.put("message", "Access granted");
        body.put("data", data);
        return ResponseEntity.ok(body);
    }

    @GetMapping("/admin")
    public ResponseEntity<Map<String, Object>> getAdminContent(HttpServletRequest request) {
        String token = TokenUtil.extractBearerToken(request);
        if (token == null) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("success", false);
            body.put("error", "Unauthorized");
            body.put("message", "Token required");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }

        Map<?, ?> payload;
        try {
            byte[] decoded = Base64.getDecoder().decode(token);
            payload = objectMapper.readValue(decoded, Map.class);
        } catch (Exception e) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("success", false);
            body.put("error", "Unauthorized");
            body.put("message", "Invalid token format");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
        }

        Map<String, Object> body = new LinkedHashMap<>();
        if ("admin".equals(payload.get("role"))) {
            body.put("success", true);
            body.put("message", "Welcome, admin!");
            return ResponseEntity.ok(body);
        }

        body.put("success", false);
        body.put("error", "Forbidden");
        body.put("message", "Not authorised");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }
}
