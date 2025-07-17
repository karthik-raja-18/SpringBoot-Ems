package com.example.springbootfirst.repository;

import com.example.springbootfirst.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByEmployeeEmpID(int empID);
}
