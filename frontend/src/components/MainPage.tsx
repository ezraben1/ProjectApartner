import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <nav>
        <ul>
          <li>
            <Link to="/owner">Owner</Link>
          </li>
          <li>
            <Link to="/renter">Renter</Link>
          </li>
          <li>
            <Link to="/searcher">Searcher</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MainPage;
