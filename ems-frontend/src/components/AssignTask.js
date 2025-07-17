import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './AssignTask.css';

const AssignTask = () => {
  const location = useLocation();
  const isAdmin = true; // TODO: Replace with real admin check

  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [task, setTask] = useState({ title: '', description: '', dueDate: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPreselected, setIsPreselected] = useState(false);
                                                                                                23CS067
  useEffect(() => {
    // If coming from HomePage Assign Task button, pre-select and filter
    if (location.state && location.state.employee) {
      setSelectedEmployee(location.state.employee);
      setEmployees([location.state.employee]);
      setIsPreselected(true);
    } else {
      fetchEmployees();
      setIsPreselected(false);
    }
    // eslint-disable-next-line
  }, [location.state]);

  useEffect(() => {
    if (!isPreselected) fetchEmployees();
    // eslint-disable-next-line
  }, [searchTerm]);

  const fetchEmployees = async () => {
    try {
      const res = await fetch(`/api/employees?search=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      });
      if (!res.ok) throw new Error('Failed to fetch employees');
      const data = await res.json();
      setEmployees(data);
    } catch (e) {
      setErrorMsg('Could not load employees');
    }
  };

  
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleTaskChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    if (!selectedEmployee) {
      setErrorMsg('Please select an employee');
      return;
    }
    try {
      const res = await fetch('/api/tasks/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ ...task, employeeId: selectedEmployee.empID })
      });
      if (!res.ok) throw new Error('Failed to assign task');
      setSuccessMsg('Task assigned successfully!');
      setTask({ title: '', description: '', dueDate: '' });
    } catch (e) {
      setErrorMsg('Failed to assign task');
    }
  };

  return (
    <div className="assign-task-container">
      <h2>Assign Task to Employee</h2>
      {!isAdmin ? (
        <div className="no-access">You do not have permission to assign tasks.</div>
      ) : (
        <>
          <div className="employee-list">
            {/* {employees.length === 0 && <div className="no-employees">No employees found</div>} */}
            {employees.map(emp => (
              <div
                key={emp.empID}
                className={`employee-item${selectedEmployee && selectedEmployee.empID === emp.empID ? ' selected' : ''}`}
                onClick={() => setSelectedEmployee(emp)}
              >
                {emp.name} (ID: {emp.empID})
              </div>
            ))}
          </div>
          <form className="task-form" onSubmit={handleAssign}>
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              value={task.title}
              onChange={handleTaskChange}
              required
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={task.description}
              onChange={handleTaskChange}
              required
            />
            <input
              type="date"
              name="dueDate"
              value={task.dueDate}
              onChange={handleTaskChange}
              required
            />
            <button type="submit">Assign Task</button>
          </form>
        </>
      )}
      {successMsg && <div className="success-msg">{successMsg}</div>}
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
    </div>
  );
};

export default AssignTask;
