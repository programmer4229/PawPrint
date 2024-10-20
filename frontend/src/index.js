import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import SignIn from './components/SignIn';
import PetSelectionPage from './components/ProfileSelection';
import PetProfile from './components/PetProfile';
import { RouterProvider } from 'react-router-dom';

import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
    {path: '/' , element: <App />},
    {path: '/signin', element: <SignIn />},
    {path: '/petselection', element: <PetSelectionPage />},
    {path: '/petprofile', element: <PetProfile />},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
