package com.example.springbootfirst.repository;

import com.example.springbootfirst.models.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee,Integer> {
    List<Employee> findByJob(String job);
    Employee findByEmpID(int empID);
}