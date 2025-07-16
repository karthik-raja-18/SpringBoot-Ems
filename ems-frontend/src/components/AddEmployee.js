import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AddEmployee.css';

const AddEmployee = () => {
  const [newEmployee, setNewEmployee] = useState({ name: '', job: '' });
  const [addEmpMsg, setAddEmpMsg] = useState('');
  const [addEmpError, setAddEmpError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setAddEmpMsg('');
    setAddEmpError('');
    setLoading(true);
    
    fetch('/employee', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(newEmployee)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Failed to add employee. Status: ${response.status}. Body: ${text}`);
          });
        }
        return response.text();
      })
      .then((msg) => {
        setAddEmpMsg(msg || 'Employee added successfully!');
        setNewEmployee({ name: '', job: '' });
      })
      .catch((error) => {
        setAddEmpError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="add-employee-container">
      <h2>Add Employee</h2>
      <form onSubmit={handleAddEmployee}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={newEmployee.name}
            onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label>Job:</label>
          <input
            type="text"
            value={newEmployee.job}
            onChange={e => setNewEmployee({ ...newEmployee, job: e.target.value })}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Adding...' : 'Submit'}
        </button>
        {addEmpMsg && <span className="success">{addEmpMsg}</span>}
        {addEmpError && <span className="error">{addEmpError}</span>}
      </form>
      <button className="back-btn" onClick={() => navigate('/home')}>Back to Home</button>
    </div>
  );
};

export default AddEmployee;
