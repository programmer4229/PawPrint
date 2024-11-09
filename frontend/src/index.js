import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SignIn from './components/SignIn';
import PetSelectionPage from './components/ProfileSelection';
import PetProfile from './components/PetProfile';
import Register from './components/Register';
import { RouterProvider } from 'react-router-dom';
import { AuthContext } from './shared/context/auth-context';
import ProtectedRoute from './shared/context/ProtectedRoutes';

import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/petselection', 
    element: 
      <ProtectedRoute>
        <PetSelectionPage />
      </ProtectedRoute> },
  { path: '/petprofile/:petId',
    element: 
      <ProtectedRoute>
        <PetProfile />
      </ProtectedRoute> },
  { path: '/register', element: <Register /> },
]);


const RootComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((userEmail, userId) => {
      setIsLoggedIn(true);
      setEmail(userEmail);
      setUserId(userId);
  }, []);

  const logout = useCallback(() => {
      setIsLoggedIn(false);
      setEmail(null);
      setUserId(null);
  }, []);

  return (
      <AuthContext.Provider value={{ isLoggedIn, email, userId, login, logout }}>
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
