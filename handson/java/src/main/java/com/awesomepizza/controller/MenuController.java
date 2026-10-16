package com.awesomepizza.controller;

import com.awesomepizza.database.InMemoryDatabase;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class MenuController {

    private final InMemoryDatabase database;

    public MenuController(InMemoryDatabase database) {
        this.database = database;
    }

    @GetMapping("/daily-menu")
    public ResponseEntity<Map<String, Object>> getDailyMenu() {
        try {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("success", true);
            body.put("data", database.getDailyMenu());
            body.put("message", "Daily menu retrieved successfully");
            return ResponseEntity.ok(body);
        } catch (Exception e) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("success", false);
            body.put("error", "Internal server error");
            body.put("message", "Failed to retrieve daily menu");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }
}
