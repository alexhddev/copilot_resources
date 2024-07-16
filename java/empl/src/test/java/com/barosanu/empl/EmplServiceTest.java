package com.barosanu.empl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.barosanu.empl.model.Employee;

public class EmplServiceTest {

    @Mock
    private EmplRepository employeeRepository;

    @InjectMocks
    private EmplService emplService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllEmployees() {
        List<Employee> mockEmployees = Arrays.asList(new Employee(), new Employee());
        when(employeeRepository.findAll()).thenReturn(mockEmployees);

        List<Employee> result = emplService.getAllEmployees();

        assertEquals(mockEmployees, result);
    }

    @Test
    public void testGetEmployeeById() {
        Employee mockEmployee = new Employee();
        when(employeeRepository.findById(1L)).thenReturn(Optional.of(mockEmployee));

        Employee result = emplService.getEmployeeById(1L);

        assertEquals(mockEmployee, result);
    }

    @Test
    public void testAddEmployee() {
        Employee mockEmployee = new Employee();
        when(employeeRepository.save(any(Employee.class))).thenReturn(mockEmployee);

        Employee result = emplService.addEmployee(mockEmployee);

        assertEquals(mockEmployee, result);
    }

    @Test
    public void testUpdateEmployeesPosition() {
        Employee mockEmployee = new Employee();
        when(employeeRepository.findById(anyLong())).thenReturn(Optional.of(mockEmployee));
        when(employeeRepository.save(any(Employee.class))).thenReturn(mockEmployee);

        String result = emplService.updateEmployeesPosition("1", "New Position");

        assertEquals("Employee position updated", result);
    }

    @Test
    public void testDeleteEmployeeById() {
        doNothing().when(employeeRepository).deleteById(anyLong());

        String result = emplService.deleteEmployeeById(1L);

        assertEquals("Employee deleted", result);
    }

    @Test
    public void testGetEmployeesByPosition() {
        List<Employee> mockEmployees = Arrays.asList(new Employee(), new Employee());
        when(employeeRepository.findByPosition("Developer")).thenReturn(mockEmployees);

        List<Employee> result = emplService.getEmployeesByPosition("Developer");

        assertEquals(mockEmployees, result);
    }
}