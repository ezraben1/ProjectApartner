import { Link } from 'react-router-dom';
import MyApartments from './MyApartments';

const OwnerPage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Owner Page</h1>
      <nav>
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/my-apartments">My Apartments</Link>
          </li>
        </ul>
      </nav>
      <MyApartments />
    </div>
  );
}

export default OwnerPage;
