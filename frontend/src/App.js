import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import SignIn from './components/SignIn';
import PetProfile from './components/PetProfile';
import PetSelectionPage from './components/ProfileSelection';


function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Sign In page */}
        <Route path="/" element={<SignIn />} />

        {/* Route for selecting a pet (e.g., after signing in) */}
        <Route path="/select-pet" element={<PetSelectionPage />} />

        {/* Dynamic route for a specific pet profile by ID */}
        <Route path="/pet/:petId" element={<PetProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
