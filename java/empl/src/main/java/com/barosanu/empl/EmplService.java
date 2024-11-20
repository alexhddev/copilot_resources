package com.barosanu.empl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.barosanu.empl.model.Employee;

@Service
public class EmplService {
    @Autowired
    private EmplRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id).get();
    }

    public Employee addEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public String updateEmployeesPosition(String id, String position){
        Employee employee = employeeRepository.findById(Long.parseLong(id)).get();
        employee.setPosition(position);
        employeeRepository.save(employee);
        return "Employee position updated";
    }

    public String deleteEmployeeById(Long id) {
        employeeRepository.deleteById(id);
        return "Employee deleted";
    }

    public List<Employee> getEmployeesByPosition(String position){
        return employeeRepository.findByPosition(position);
    }

    public Employee getEmployeeByFullName(String firstName, String lastName) {
        return employeeRepository.findByFirstNameAndLastName(firstName, lastName);
    }
}