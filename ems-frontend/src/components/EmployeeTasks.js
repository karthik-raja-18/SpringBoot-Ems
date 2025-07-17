import React, { useEffect, useState } from 'react';
import './AssignTask.css';

const EmployeeTasks = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('/employee', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load employees');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredEmployees(
      employees.filter(emp => {
        const id = String(emp.empID || emp.id || '').toLowerCase();
        const name = (emp.name || '').toLowerCase();
        return (
          id.includes(searchTerm.toLowerCase()) ||
          name.includes(searchTerm.toLowerCase())
        );
      })
    );
  }, [employees, searchTerm]);

  const handleShowTasks = (emp) => {
    setSelectedEmployee(emp);
    setTasks([]);
    setLoading(true);
    fetch(`/api/tasks/employee/${emp.empID || emp.id}`, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch tasks');
        return res.json();
      })
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setTasks([]);
        setLoading(false);
        setError('Failed to load tasks');
      });
  };

  return (
    <div className="assign-task-container">
      <h2>Employees & Their Tasks</h2>
      <input
        type="text"
        placeholder="Search by Employee ID or Name..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="search-bar"
        style={{ marginBottom: 16 }}
      />
      {loading && <div>Loading...</div>}
      {error && <div className="error-msg">{error}</div>}
      {!selectedEmployee ? (
        <div className="employee-list">
          {filteredEmployees.length === 0 && <div className="no-employees">No employees found</div>}
          {filteredEmployees.map(emp => (
            <div
              key={emp.empID || emp.id}
              className="employee-item"
              onClick={() => handleShowTasks(emp)}
            >
              {emp.name} (ID: {emp.empID || emp.id})
            </div>
          ))}
        </div>
      ) : (
        <div style={{ width: '100%' }}>
          <button style={{marginBottom:'12px'}} onClick={() => setSelectedEmployee(null)}>Back to Employees</button>
          <h3 style={{marginBottom:'8px'}}>Tasks for {selectedEmployee.name} (ID: {selectedEmployee.empID || selectedEmployee.id})</h3>
          {tasks.length === 0 ? (
            <div className="no-employees">No tasks found for this employee.</div>
          ) : (
            <ul style={{paddingLeft: '18px'}}>
              {tasks.map(task => (
                <li key={task.id} style={{marginBottom:'8px'}}>
                  <strong>{task.title}</strong> - {task.description} <br/>
                  <span style={{fontSize:'0.95em',color:'#888'}}>Due: {task.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployeeTasks;
