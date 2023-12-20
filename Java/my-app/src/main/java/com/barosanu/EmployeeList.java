package com.barosanu;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class EmployeeList {

    private List<Employee> employees = new ArrayList<Employee>();

    public void addEmployee(Employee employee) {
        employees.add(employee);
    }

    public String[] getEmployeesNames() {
        String[] names = new String[employees.size()];
        for (int i = 0; i < employees.size(); i++) {
            names[i] = employees.get(i).getName();
        }
        return names;
    }

    public String[] getEmployeesNamesWithStreams() {
        return employees.stream().map(Employee::getName).toArray(String[]::new);
    }

    public List<Employee> getEmployeesSortedByAge() {
        employees.sort((e1, e2) -> e1.getAge() - e2.getAge());
        return employees;
    }

    public List<Employee> getEmployeesWithSalaryGreaterThan(int salary) {
        List<Employee> filteredEmployees = new ArrayList<Employee>();
        for (Employee e : employees) {
            if (e.getSalary() > salary) {
                filteredEmployees.add(e);
            }
        }
        return filteredEmployees;
    }

    public List<Employee> getEmployeesWithSalaryGreaterThanWithStreams(int salary) {
        return employees
                .stream()
                .filter(e -> e.getSalary() > salary)
                .sorted(Comparator.comparingInt(Employee::getSalary))
                .collect(Collectors.toList());
    }
}
