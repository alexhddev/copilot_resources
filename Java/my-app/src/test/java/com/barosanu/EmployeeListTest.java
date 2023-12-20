package com.barosanu;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertIterableEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class EmployeeListTest {

    private EmployeeList employeeList;
    
    @BeforeEach
    public void setUp() {
        employeeList = new EmployeeList();
        employeeList.addEmployee(new Employee("John", 25, 3000));
        employeeList.addEmployee(new Employee("Mary", 27, 4000));
        employeeList.addEmployee(new Employee("Paul", 25, 5000));
        employeeList.addEmployee(new Employee("Ana", 30, 6000));
        employeeList.addEmployee(new Employee("Mark", 30, 6000));
        employeeList.addEmployee(new Employee("Steve", 30, 5500));
    }

    @Test
    public void testGetEmployeesNames() {
        String[] expectedNames = {"John", "Mary", "Paul", "Ana", "Mark", "Steve"};
        String[] names = employeeList.getEmployeesNames();
        assertArrayEquals(expectedNames, names);        
    }

    @Test
    public void testGetEmployeesNamesWithStreams() {
        String[] expectedNames = {"John", "Mary", "Paul", "Ana", "Mark", "Steve"};
        String[] names = employeeList.getEmployeesNamesWithStreams();
        assertArrayEquals(expectedNames, names);        
    }

    @Test
    public void testGetEmployeesSortedByAge() {
        List<Employee> expectedEmployeeList = new ArrayList<>();
        expectedEmployeeList.add(new Employee("John", 25, 3000));
        expectedEmployeeList.add(new Employee("Paul", 25, 5000));
        expectedEmployeeList.add(new Employee("Mary", 27, 4000));
        expectedEmployeeList.add(new Employee("Ana", 30, 6000));
        expectedEmployeeList.add(new Employee("Mark", 30, 6000));
        expectedEmployeeList.add(new Employee("Steve", 30, 5500));

        List<Employee> sortedEmployeeList = employeeList.getEmployeesSortedByAge();        

        assertIterableEquals(expectedEmployeeList, sortedEmployeeList);
    }

    @Test
    public void testGetEmployeesWithSalaryGreaterThan() {
        List<Employee> expectedEmployeeList = new ArrayList<>();
        expectedEmployeeList.add(new Employee("Ana", 30, 6000));
        expectedEmployeeList.add(new Employee("Mark", 30, 6000));
        expectedEmployeeList.add(new Employee("Steve", 30, 5500));

        List<Employee> filteredEmployeeList = employeeList.getEmployeesWithSalaryGreaterThan(5000);        

        assertIterableEquals(expectedEmployeeList, filteredEmployeeList);
    }

    @Test
    public void testGetEmployeesWithSalaryGreaterThanWithStreams() {
        List<Employee> expectedEmployeeList = new ArrayList<>();
        expectedEmployeeList.add(new Employee("Steve", 30, 5500));
        expectedEmployeeList.add(new Employee("Ana", 30, 6000));
        expectedEmployeeList.add(new Employee("Mark", 30, 6000));

        List<Employee> filteredEmployeeList = employeeList.getEmployeesWithSalaryGreaterThanWithStreams(5000);        

        assertIterableEquals(expectedEmployeeList, filteredEmployeeList);
    }


    
}
