import React from 'react';
import { Link } from "react-router-dom";

type HomeProps = {
  currentUser: any;
};

const HomePage: React.FC<HomeProps> = ({ currentUser }) => {
  return (
    <div>
      <h1>Welcome to the home page</h1>
      <nav>
        <ul>
          <li>
            <Link to="/core">Core</Link>
          </li>
          <li>
            <Link to="/owner">Owner</Link>
          </li>
          <li>
            <Link to="/searcher">Searcher</Link>
          </li>
          <li>
            <Link to="/renter">Renter</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      {currentUser && <p>Logged in as {currentUser.username}</p>}
    </div>
  );
};

export default HomePage;
