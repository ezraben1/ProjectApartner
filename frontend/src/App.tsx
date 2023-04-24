import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/HomePage';
import Profile from './pages/Profile';
import OwnerPage from './pages/OwnerPage';
import MyApartments from './pages/MyApartments';

interface AppProps {
  onLoginSuccess: (token: string | undefined) => void;
}

function App({ onLoginSuccess }: AppProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLoginSuccess = (token?: string) => {
    setCurrentUser(token);
    onLoginSuccess(token);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/me" element={<Profile />} />
        <Route path="/owner" element={<OwnerPage />} />
        <Route path="/owner/my-apartments" element={<MyApartments />} />
      </Routes>
    </Router>
  );
}

export default App;
