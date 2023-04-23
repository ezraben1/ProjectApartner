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

export default AppRoutes;
