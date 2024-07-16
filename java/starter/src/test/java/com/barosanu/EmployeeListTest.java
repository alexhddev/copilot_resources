package com.barosanu;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class EmployeeListTest {

    private EmployeeList employeeList;

    @BeforeEach
    public void setUp() {
        employeeList = new EmployeeList();
    }

    @Test
    public void testAddEmployee() {
        Employee employee = new Employee("John Doe", 30, 5000);
        employeeList.addEmployee(employee);
        assertEquals(1, employeeList.getEmployees().size());
        assertEquals(employee, employeeList.getEmployees().get(0));
    }

    @Test
    public void testGetEmployeesNames() {
        Employee employee1 = new Employee("John Doe", 30, 5000);
        Employee employee2 = new Employee("Jane Smith", 25, 6000);
        employeeList.addEmployee(employee1);
        employeeList.addEmployee(employee2);
        String[] expectedNames = { "John Doe", "Jane Smith" };
        assertArrayEquals(expectedNames, employeeList.getEmployeesNames());
    }

    @Test
    public void testGetEmployeesNamesWithStreams() {
        Employee employee1 = new Employee("John Doe", 30, 5000);
        Employee employee2 = new Employee("Jane Smith", 25, 6000);
        employeeList.addEmployee(employee1);
        employeeList.addEmployee(employee2);
        String[] expectedNames = { "John Doe", "Jane Smith" };
        assertArrayEquals(expectedNames, employeeList.getEmployeesNamesWithStreams());
    }

    @Test
    public void testGetEmployeesSortedByAge() {
        Employee employee1 = new Employee("John Doe", 30, 5000);
        Employee employee2 = new Employee("Jane Smith", 25, 6000);
        employeeList.addEmployee(employee1);
        employeeList.addEmployee(employee2);
        List<Employee> expectedEmployees = new ArrayList<>();
        expectedEmployees.add(employee2);
        expectedEmployees.add(employee1);
        assertEquals(expectedEmployees, employeeList.getEmployeesSortedByAge());
    }

    @Test
    public void testGetEmployeesWithSalaryGreaterThan() {
        Employee employee1 = new Employee("John Doe", 30, 5000);
        Employee employee2 = new Employee("Jane Smith", 25, 6000);
        Employee employee3 = new Employee("Bob Johnson", 35, 7000);
        employeeList.addEmployee(employee1);
        employeeList.addEmployee(employee2);
        employeeList.addEmployee(employee3);
        List<Employee> expectedEmployees = new ArrayList<>();
        expectedEmployees.add(employee2);
        expectedEmployees.add(employee3);
        assertEquals(expectedEmployees, employeeList.getEmployeesWithSalaryGreaterThan(5500));
    }
}