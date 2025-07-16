import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import Logout from './components/Logout';
import HomePage from './components/HomePage';
import AddEmployee from './components/AddEmployee';

function App() {
  return (
    <Router>
      {window.location.pathname !== '/' && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-employee" element={<AddEmployee />} />
      </Routes>
    </Router>
  );
}

export default App;
