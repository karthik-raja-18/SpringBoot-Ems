package com.example.springbootfirst.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int empID;

    private String name;
    private String job;

    // No-arg constructor
    public Employee() {
    }

    // All-args constructor
    public Employee(int empID, String name, String job) {
        this.empID = empID;
        this.name = name;
        this.job = job;
    }

    // Getters and Setters
    public int getEmpID() {
        return empID;
    }

    public void setEmpID(int empID) {
        this.empID = empID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    // toString method (optional)
    @Override
    public String toString() {
        return "Employee{" +
                "empID=" + empID +
                ", name='" + name + '\'' +
                ", job='" + job + '\'' +
                '}';
    }
}
