import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setCurrentUser }: { setCurrentUser: (user: any) => void }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post<{ access: string; refresh: string; user: any }>(
        'http://localhost:8000/login/',
        {
          username: username,
          password: password,
        }
      );
      const access_token = response.data.access;
      const refresh_token = response.data.refresh;
      const expiration_time = new Date(new Date().getTime() + 3600 * 1000); // Expires in 1 hour
  
      document.cookie = `access_token=${access_token};expires=${expiration_time};path=/;secure=true;samesite=none;`;
      document.cookie = `refresh_token=${refresh_token};expires=${expiration_time};path=/;secure=true;samesite=none;`;
      
      console.log(document.cookie);
  
      setCurrentUser(response.data.user);
      navigate('/');
    } catch (error: any) {
      setError(error.response?.data?.Invalid || 'An error occurred during login.');
    }
  };
  
  

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username">Username: </label>
        <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
