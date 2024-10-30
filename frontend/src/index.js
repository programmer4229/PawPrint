import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SignIn from './components/SignIn';
import PetSelectionPage from './components/ProfileSelection';
import PetProfile from './components/PetProfile';
import { RouterProvider } from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';
import ProtectedRoute from './shared/context/ProtectedRoutes';

import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
    {path: '/' , element: <App />},
    {path: '/signin', element: <SignIn />},
    {path: '/petselection',
      element:
        <ProtectedRoute>
          <PetSelectionPage />
        </ProtectedRoute>},
    {path: '/petprofile', 
      element: 
        <ProtectedRoute>
          <PetProfile />
        </ProtectedRoute>},
]);

const RootComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = useCallback(() => {
      setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
      setIsLoggedIn(false);
  }, []);

  return (
      <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
          <RouterProvider router={router} />
      </AuthContext.Provider>
  );
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
