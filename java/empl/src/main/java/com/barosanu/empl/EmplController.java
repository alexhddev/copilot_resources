package com.barosanu.empl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.barosanu.empl.model.Employee;

@RestController
@RequestMapping("/employees")
@CrossOrigin(origins = "*")
public class EmplController {

    @Autowired
    private EmplService emplService;

    @GetMapping("/all")
    public List<Employee> getAllEmployees() {
        return emplService.getAllEmployees();
    }

    @GetMapping("/get")
    public List<Employee> getEmployeesByPosition(@RequestParam(required = true) String position) {
        return emplService.getEmployeesByPosition(position);
    }

    @GetMapping("/getByFullName")
    public Employee getEmployeeByFullName(@RequestParam String firstName, @RequestParam String lastName) {
        return emplService.getEmployeeByFullName(firstName, lastName);
    }

    @PostMapping("/add")
    public Employee addEmployee(@RequestBody Employee employee) {
        return emplService.addEmployee(employee);
    }

    @PutMapping("/{id}")
    public String updateEmployeesPosition(@PathVariable String id, @RequestBody Employee employee) {
        return emplService.updateEmployeesPosition(id, employee.getPosition());
    }

    @DeleteMapping("/{id}")
    public String deleteEmployeeById(@PathVariable Long id) {
        return emplService.deleteEmployeeById(id);
    }
}
