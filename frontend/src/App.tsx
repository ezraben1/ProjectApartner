import React, { useState } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import OwnerRoutes from './components/owner/Owner';
import SearcherRoutes from './components/searcher/Searcher';
import Login from './components/LoginPage'; // Import the Login component
// Other imports, such as components or styles, can be added here

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(null);

  // You can pass the currentUser state to child components as props

  return (
    <Router>
      <div>
        {/* Add navigation links here */}
        <nav>
          <ul>
            <li>
              <Link to="/owner">Owner</Link>
            </li>
            <li>
              <Link to="/searcher">Searcher</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>

        {/* Define your routes here */}
        <Routes>
          <Route path="/owner/*" element={<OwnerRoutes currentUser={currentUser} />} />
          <Route path="/searcher/*" element={<SearcherRoutes currentUser={currentUser} />} />
          <Route path="/login/*" element={<Login setCurrentUser={setCurrentUser} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
