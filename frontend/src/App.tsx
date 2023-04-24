import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile"
interface AppProps {
  onLoginSuccess: (token: string) => void;
}

function App({ onLoginSuccess }: AppProps) {
  const handleLoginSuccess = (token: string) => {
    onLoginSuccess(token);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home currentUser={null} />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/me"
          element={<Profile />}
        />
      </Routes>
    </Router>
  );
}


export default App;
