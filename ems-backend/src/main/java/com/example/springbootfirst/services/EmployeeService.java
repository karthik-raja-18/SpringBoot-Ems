package com.example.springbootfirst.services;

import com.example.springbootfirst.models.Employee;
import com.example.springbootfirst.repository.EmployeeRepository;
import com.example.springbootfirst.repository.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository empRepo;

    @Autowired
    private RolesRepository rolesRepository;

    public List<Employee> getMethod() {
        return empRepo.findAll();
    }

    public List<Employee> searchByIdOrName(String search) {
        try {
    int empID = Integer.parseInt(search);
    // If search is an integer, search by empID or name
    return empRepo.findByEmpIDOrNameContainingIgnoreCase(empID, search);
} catch (NumberFormatException e) {
    // If search is not an integer, search by name only
    return empRepo.findByNameContainingIgnoreCase(search);
}
    }

    public Employee getEmployeeById(int empID) {
        return empRepo.findByEmpID(empID);
    }

    public List<Employee> getEmployeeByJob(String job) {
        return empRepo.findByJob(job);
    }

    public String addEmployee(Employee employee) {
        empRepo.save(employee);
        return "Employee Added Successfully!!!";
    }


    public String updateEmployeeById(int id, Employee updated) {
        Employee existing = empRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + id));
        existing.setName(updated.getName());
        existing.setJob(updated.getJob());
        // ✅ Removed email
        empRepo.save(existing);
        return "Employee with ID " + id + " updated successfully.";
    }

    public String deleteEmployeeById(int empID) {
        empRepo.deleteById(empID);
        return "Employee Deleted Successfully!!!";
    }

}