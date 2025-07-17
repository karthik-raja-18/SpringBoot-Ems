import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import '../styles/HomePage.css';

const HomePage = () => {
  // ...existing state
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: '', job: '' });
  const [displayEmployee, setDisplayEmployee] = useState(null);

  // Display employee details
  const handleDisplayEmployee = (emp) => {
    setDisplayEmployee(emp);
  };
  const closeDisplayEmployee = () => setDisplayEmployee(null);

  // Start editing an employee
  const startEdit = (emp) => {
    setEditingId(emp.empID || emp.id);
    setEditData({ name: emp.name, job: emp.job || '' });
  };

  // Cancel editing
  const cancelEdit = (e) => {
    if (e) e.preventDefault();
    setEditingId(null);
    setEditData({ name: '', job: '' });
  };

  // Update employee handler
  const handleUpdateEmployee = (empID) => {
    fetch(`/employee/${empID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(editData)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => {
            alert(`Failed to update employee. Status: ${response.status}. Body: ${text}`);
            throw new Error(text);
          });
        }
        // Update employee in state
        setEmployees((prev) => prev.map(emp =>
          (emp.empID || emp.id) === empID ? { ...emp, ...editData } : emp
        ));
        setEditingId(null);
        setEditData({ name: '', job: '' });
      })
      .catch((error) => {
        alert('Error updating employee: ' + error.message);
      });
  };

  // Delete employee handler
  const handleDeleteEmployee = (empID, name) => {
    if (!window.confirm(`Are you sure you want to delete employee '${name}' (ID: ${empID})?`)) return;
    fetch(`/employee/${empID}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => {
            alert(`Failed to delete employee. Status: ${response.status}. Body: ${text}`);
            throw new Error(text);
          });
        }
        // Remove from local state
        setEmployees((prev) => prev.filter(emp => (emp.empID || emp.id) !== empID));
      })
      .catch((error) => {
        alert('Error deleting employee: ' + error.message);
      });
  };

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);

  const navigate = useNavigate();

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

  // Show Employees handler
  const handleShowEmployees = () => {
    setShowEmployeeList(true);
    setLoading(true);
    setError(null);
    setEmployees([]);
    fetch('/employee', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then((response) => {
        console.log('Fetch /employee status:', response.status);
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Network response was not ok. Status: ${response.status}. Body: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  // Listen for showEmployees event from header
  useEffect(() => {
    const listener = () => handleShowEmployees();
    window.addEventListener('showEmployees', listener);
    return () => window.removeEventListener('showEmployees', listener);
  }, []);


  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome!</h1>
        <p>You have successfully logged in to the Employee Management System.</p>
        <p>Here you can manage employees, view details, and more.</p>
        <button className="home-btn" onClick={handleShowEmployees} disabled={loading}>Show Employees</button>
        {/* <button className="home-btn" onClick={() => navigate('/add-employee')}>Add Employee</button> */}
        {showEmployeeList && (
          <>
            <h2>Employee Names</h2>
            <input
              type="text"
              placeholder="Search by Employee ID or Name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '1rem' }}
            />
            {loading && <p>Loading employees...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && !error && filteredEmployees.length === 0 && <p>No employees found.</p>}
            {!loading && !error && filteredEmployees.length > 0 && (
              <table className="employee-table" style={{width:'100%', borderCollapse:'collapse', marginTop:'16px'}}>
                <thead>
                  <tr style={{background:'#f5f5f5'}}>
                    <th style={{border:'1px solid #ddd', padding:'8px'}}>Employee ID</th>
                    <th style={{border:'1px solid #ddd', padding:'8px'}}>Name</th>
                    <th style={{border:'1px solid #ddd', padding:'8px'}}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.empID || emp.id}>
                      <td style={{border:'1px solid #ddd', padding:'8px'}}>{emp.empID || emp.id}</td>
                      <td style={{border:'1px solid #ddd', padding:'8px'}}>{editingId === (emp.empID || emp.id) ? (
                        <input type="text" value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} />
                      ) : emp.name}</td>
                      <td style={{border:'1px solid #ddd', padding:'8px'}}>
                        {editingId === (emp.empID || emp.id) ? (
                          <>
                            <input type="text" value={editData.job} onChange={e => setEditData({...editData, job: e.target.value})} placeholder="Job" style={{marginRight:'8px'}} />
                            <button style={{background:'#388e3c',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'5px',cursor:'pointer',marginRight:'6px'}} onClick={() => handleUpdateEmployee(emp.empID || emp.id)}>Save</button>
                            <button style={{background:'#aaa',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'5px',cursor:'pointer'}} onClick={cancelEdit}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button style={{background:'#1976d2',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'5px',cursor:'pointer',marginRight:'6px'}} onClick={() => startEdit(emp)}>Update</button>
                            <button style={{background:'#d32f2f',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'5px',cursor:'pointer',marginRight:'6px'}} onClick={() => handleDeleteEmployee(emp.empID || emp.id, emp.name)}>Delete</button>
                            <button style={{background:'#6d4cff',color:'#fff',border:'none',padding:'6px 12px',borderRadius:'5px',cursor:'pointer',marginRight:'6px'}} onClick={() => handleDisplayEmployee(emp)}>
                              Display
                            </button>
                            <button style={{background:'#ffe066',color:'#232135',border:'none',padding:'6px 12px',borderRadius:'5px',cursor:'pointer'}} onClick={() => navigate('/assign-task', { state: { employee: emp } })}>
                              Assign Task
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
        {displayEmployee && (
          <div style={{marginTop:'24px',padding:'20px',background:'#f6f6fa',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',maxWidth:'400px'}}>
            <h3>Employee Details</h3>
            <p><strong>Employee ID:</strong> {displayEmployee.empID || displayEmployee.id}</p>
            <p><strong>Name:</strong> {displayEmployee.name}</p>
            <p><strong>Job/Role:</strong> {displayEmployee.job || displayEmployee.role || '-'}</p>
            <button style={{marginTop:'12px',background:'#aaa',color:'#fff',border:'none',padding:'6px 16px',borderRadius:'5px',cursor:'pointer'}} onClick={closeDisplayEmployee}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
