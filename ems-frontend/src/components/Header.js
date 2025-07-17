import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  return (
    <header className="ems-header">
      <div className="ems-header__left">
        <span className="ems-header__brand">Employee Management System!!!</span>
      </div>
      <nav className="ems-header__nav">
        <Link className={`ems-header__link${location.pathname === '/home' ? ' active' : ''}`} to="/home">Home</Link>
        <Link className={`ems-header__link${location.pathname === '/add-employee' ? ' active' : ''}`} to="/add-employee">Add Employee</Link>
        <Link className={`ems-header__link${location.pathname === '/assign-task' ? ' active' : ''}`} to="/assign-task">Assign Task</Link>
        <Link className={`ems-header__link${location.pathname === '/employee-tasks' ? ' active' : ''}`} to="/employee-tasks">Employee Tasks</Link>
        <Link className={`ems-header__link${location.pathname === '/login' ? ' active' : ''}`} to="/login">Login</Link>
        <Link className={`ems-header__link${location.pathname === '/logout' ? ' active' : ''}`} to="/logout">Logout</Link>
      </nav>
      {location.pathname === '/home' && (
        <button
          className="ems-header__show-employees-btn"
          style={{ marginLeft: '20px', padding: '7px 16px', borderRadius: '6px', border: 'none', background: '#ffe066', color: '#232135', fontWeight: 600, cursor: 'pointer' }}
          onClick={() => window.dispatchEvent(new Event('showEmployees'))}
        >
        </button>
      )}
    </header>
  );
};

export default Header;
