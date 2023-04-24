import { useState } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../auth";
import Cookies from 'js-cookie';
import api from "../api";

interface LoginProps {
  onLoginSuccess: () => void;
}

function Login({ onLoginSuccess }: LoginProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState<any>(null); // state to store logged in user

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    try {
      const response = await auth.login({ username, password });
  
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access);
        Cookies.set('access_token', data.access); // set the access_token in the cookies
        onLoginSuccess();
  
        // fetch user details and set the logged in user state
        const userResponse = await api.getUserDetails();
        if (userResponse.ok) {
          const user = await userResponse.json();
          setLoggedInUser(user);
        }
  
        navigate("/");
      } else {
        setError("Invalid credentials");
      }
    } catch (error) {
      setError("An error occurred while logging in");
    }
  };

  return (
    <div>
      {loggedInUser && <p>Welcome {loggedInUser.username}!</p>}
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {error && <p>{error}</p>}
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
