package com.barosanu.empl;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/employees")
public class EmplController {

    @GetMapping("/all")
    public String getAllEmployees() {
        // Logic to fetch all employees
        return "List of employees";
    }
    
}
