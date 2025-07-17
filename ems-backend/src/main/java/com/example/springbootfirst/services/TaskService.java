package com.example.springbootfirst.services;

import com.example.springbootfirst.models.Task;
import com.example.springbootfirst.models.Employee;
import com.example.springbootfirst.repository.TaskRepository;
import com.example.springbootfirst.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    public Task assignTask(int employeeId, String title, String description, String dueDate) {
        Optional<Employee> employeeOpt = employeeRepository.findById(employeeId);
        if (!employeeOpt.isPresent()) {
            throw new RuntimeException("Employee not found");
        }
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setDueDate(java.time.LocalDate.parse(dueDate));
        task.setEmployee(employeeOpt.get());
        return taskRepository.save(task);
    }

    public List<Task> getTasksForEmployee(int empID) {
        return taskRepository.findByEmployeeEmpID(empID);
    }
}
