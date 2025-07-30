package com.example.springbootfirst.controllers;

import com.example.springbootfirst.models.Task;
import com.example.springbootfirst.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    @Autowired
    private TaskService taskService;                                    

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/assign")
    public ResponseEntity<?> assignTask(@RequestBody Map<String, String> payload) {
        try {
            int employeeId = Integer.parseInt(payload.get("employeeId"));
            String title = payload.get("title");
            String description = payload.get("description");
            String dueDate = payload.get("dueDate");
            Task task = taskService.assignTask(employeeId, title, description, dueDate);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Task assigned successfully");
            response.put("task", task);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Task>> getTasksForEmployee(@PathVariable int employeeId) {
        return ResponseEntity.ok(taskService.getTasksForEmployee(employeeId));
    }
}
