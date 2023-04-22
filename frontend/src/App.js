import {
  HashRouter as Router,
  Route
} from "react-router-dom";


import './App.css';
import Header from './components/Header'

function App() {
  return (
    <Router>
      <div className="container dark">
        <div className="app">
          <Header />
        </div>
      </div>
    </Router>
  );
}

export default App;
