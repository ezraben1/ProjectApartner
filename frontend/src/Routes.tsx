// src/Routes.tsx
import { Route, BrowserRouter, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Owner from "./pages/OwnerPage";
import Searcher from "./pages/SearcherPage";
import Renter from "./pages/RenterPage";
import { useUserContext } from "./UserContext";

function AppRoutes() {
  // Add this line to get the currentUser from the UserContext
  const { currentUser } = useUserContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route path="/login" element={<Login onLoginSuccess={() => {}} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/owner/*" element={<Owner />} />
        <Route path="/searcher" element={<Searcher />} />
        <Route path="/renter" element={<Renter />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
