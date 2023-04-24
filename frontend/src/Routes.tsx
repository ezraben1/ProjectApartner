import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import MainPage from './components/MainPage';
import OwnerPage from './components/owner/Owner';
import RenterPage from './components/renter/Renter';
import SearcherPage from './components/searcher/Searcher';
import ProtectedRoute from './ProtectedRoute';
import Login from './components/LoginPage';

const AppRoutes = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // Get the user type from your authentication system
  const user_type: string | undefined = 'user'; // Replace this with the actual user type value

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <ProtectedRoute
          path="/owner/*"
          element={<OwnerPage />}
          user_type={user_type}
          allowed_user_types={['user']}
        />
        <ProtectedRoute
          path="/renter/*"
          element={<RenterPage />}
          user_type={user_type}
          allowed_user_types={['renter']}
        />
        <ProtectedRoute
          path="/searcher/*"
          element={<SearcherPage />}
          user_type={user_type}
          allowed_user_types={['searcher']}
        />
      </Routes>
    </Router>
  );
};
<<<<<<< Updated upstream
=======
=======
// src/Routes.tsx
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import OwnerRoutes from "./pages/Owner/OwnerRoutes"; // Add this import
import Searcher from "./pages/Searcher/SearcherPage";
import Renter from "./pages/Renter/RenterPage";
import { useUserContext } from "./utils/UserContext";

function AppRoutes() {
  const { currentUser } = useUserContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/owner/*" element={<OwnerRoutes />} />
        <Route path="/searcher" element={<Searcher />} />
        <Route path="/renter" element={<Renter />} />
      </Routes>
    </BrowserRouter>
  );
}
>>>>>>> 2bfd8bb (hi shahaf)
>>>>>>> Stashed changes

export default AppRoutes;
