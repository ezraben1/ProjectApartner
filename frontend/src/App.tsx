<<<<<<< Updated upstream
=======
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream

=======
=======
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile"
=======
import React, { useState } from 'react';
=======
import { useState } from 'react';
>>>>>>> c73cfed (added few pages for owner, also bootsrap design!)
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home/HomePage';
import Profile from './pages/Profile';
import OwnerPage from './pages/Owner/OwnerPage';
import MyApartments from './components/Apartment/MyApartments';
import OwnerRoutes from './pages/Owner/OwnerRoutes';
import MyRooms from './components/Room/MyRooms';
import Layout from './layout/Layout';
import MinimalExample from './pages/MinimalExample';
import MyContracts from './components/Contract/MyContracts';
import SingleContract from './components/Contract/SingleContract';
import SingleApartment from './components/Apartment/SingleApartment';
import SingleRoom from './components/Room/OwnerSingleRoom';
import SignUp from './pages/SignUp';
import { ChakraProvider } from '@chakra-ui/react';
import PublicSingleRoom from './components/Room/PublicSingleRoom';

<<<<<<< HEAD
>>>>>>> 2bfd8bb (hi shahaf)
interface AppProps {
  onLoginSuccess: (token: string | undefined) => void;
}

function App({ onLoginSuccess }: AppProps) {
=======
function App() {
>>>>>>> c73cfed (added few pages for owner, also bootsrap design!)
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLoginSuccess = (token?: string) => {
    setCurrentUser(token);
  };

  return (
    <ChakraProvider>
      <Router>
        <Layout currentUser={currentUser} onLoginSuccess={handleLoginSuccess}>
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/test/:id" element={<PublicSingleRoom/>} />

            <Route path="/me" element={<Profile />} />
            <Route path="/owner" element={<OwnerPage />} />
            <Route path="/owner/*" element={<OwnerRoutes />} />
            <Route path="/owner/my-apartments" element={<MyApartments />} />
            <Route path="/owner/my-apartments/:id" element={<SingleApartment />} />
            <Route path="/owner/my-apartments/:id/room/:id" element={<SingleRoom />} />
            <Route path="/owner/my-rooms" element={<MyRooms />} />
            <Route path="/owner/my-rooms/:id" element={<SingleRoom />} />
            <Route path="/owner/my-contracts" element={<MyContracts />} />
            <Route path="/owner/contracts/:id" element={<SingleContract />} />

            <Route path="/test" element={<MinimalExample />} />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
}

<<<<<<< HEAD
>>>>>>> 67afe1c (Now we have login system in react!)

=======
>>>>>>> 2bfd8bb (hi shahaf)
>>>>>>> Stashed changes
export default App;
