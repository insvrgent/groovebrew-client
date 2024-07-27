import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginPage.css';
import RouletteWheel from '../components/RouletteWheel';
import { loginUser } from '../helpers/userHelpers'; // Import from userHelper.js

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation hook instead of useSearchParams
  const searchParams = new URLSearchParams(location.search); // Pass location.search directly

  const next = searchParams.get('next');
  console.log(next);
  const handleLogin = async (email, username, password) => {
    try {
      const response = await loginUser(username, password);

      if (response.success) {
        localStorage.setItem("auth", response.token);
        
        if (response.cafeId !== null) {
          navigate(`/${response.cafeId}`);
        } else {
          if (next) navigate(`/${next}`);
          else navigate('/');
        }
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error occurred while logging in:', error.message);
    }
  };

  return (
    <div className="login-container">
      <RouletteWheel onSign={handleLogin} />
    </div>
  );
};

export default LoginPage;
