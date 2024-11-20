package com.barosanu.empl;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

import com.barosanu.empl.model.Employee;

public interface EmplRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByPosition(String position);

    Employee findByFirstNameAndLastName(String firstName, String lastName);
}