import { Link,Outlet } from 'react-router-dom';

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
            <Link to="/me">Profile</Link>
          </li>
          <li>
            <Link to="/owner/my-apartments">My Apartments</Link>
          </li>
          <li>
            <Link to="/owner/my-rooms">My Rooms</Link>
          </li>
        </ul>
      </nav>
      <Outlet /> 
    </div>
  );
}

export default OwnerPage;
