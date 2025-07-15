package com.example.springbootfirst.controllers;


import com.example.springbootfirst.models.Employee;
import com.example.springbootfirst.services.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/")
    public String route(){
        return "Welcome to SpringBoot Security";
    }

    @GetMapping("/employee")
    public List<Employee> getMethod(){
        return employeeService.getMethod();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/employee/{empID}")
    public Employee getEmployeeById(@PathVariable int empID){
        return employeeService.getEmployeeById(empID);
    }

    @GetMapping("/employee/job/{job}")
    public List<Employee> getEmployeeByJob(@PathVariable String job){
        return employeeService.getEmployeeByJob(job);
    }

    @PostMapping("/employee")
    public String postMethod(@RequestBody Employee employee){
        return employeeService.addEmployee(employee);
    }


    @PutMapping("/employee/{empID}")
    public String putMethod(@PathVariable int empID, @RequestBody Employee e){
        return employeeService.updateEmployeeById(empID,e);
    }

    @DeleteMapping("/employee/{empID}")
    public String deleteMethod(@PathVariable int empID){
        return employeeService.deleteEmployeeById(empID);
    }
}