import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.scss';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, userId } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);

      navigate(`/profile/${userId}`);
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("Failed to login. Please check your credentials.");
    }
  };

  return (
    <div className='login'>
      <h1 className='login__title'>Log In</h1>
      <form onSubmit={handleSubmit} className='login__form'>
        <div className='login__form-field'>
          <label htmlFor="email" className='login__label'>Email</label>
          <input
          type="email"
          id='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='login__input'
          required                   
          />
        </div>

        <div className='login__form-field'>
          <label htmlFor="password" className='login__label'>Password</label>
          <input
          type="password"
          id='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='login__input'
          required                   
          />
        </div>

        {errorMessage && <p className='login__error'>{errorMessage}</p>}

        <button type='submit' className='login__button'>Log In</button>

        <p className='login__forgot-password'>
          <Link to='/forgot-password' className='login__forgot-password--link'>Forgot your password?</Link>
        </p>
      </form>
    </div>
   );
}

export default LoginForm;
