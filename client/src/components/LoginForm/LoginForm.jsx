import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.scss';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function LoginForm() {
  // State hooks to manage the email, password inputs, and error messages
  const [email, setEmail] = useState('');           // State to store the email input from the user
  const [password, setPassword] = useState('');     // State to store the password input from the user
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages during login attempts
  const navigate = useNavigate(); // Hook to programmatically navigate to different routes

  // Event handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the login API endpoint with the user's email and password
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      // Extract the token and user data from the response
      const { token, user } = response.data;

      // Store the authentication token and user ID in localStorage for future requests
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', user.id);

      // Navigate to the user's profile page upon successful login
      navigate(`/profile/${user.id}`);
    } catch (error) {
      // Handle errors, log them, and set an appropriate error message
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
