import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AssignTask.css';
import { employeeApi } from '../services/api';

const EmployeeTasks = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await employeeApi.getEmployees();
        setEmployees(response.data);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees');
        if (err.response && err.response.status === 401) {
          // Unauthorized - token might be invalid or expired
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [navigate]);

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

  const handleShowTasks = async (emp) => {
    setSelectedEmployee(emp);
    setTasks([]);
    setLoading(true);
    try {
      const response = await employeeApi.getEmployeeTasks(emp.empID || emp.id);
      setTasks(response.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      if (err.response && err.response.status === 401) {
        // Unauthorized - token might be invalid or expired
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
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
