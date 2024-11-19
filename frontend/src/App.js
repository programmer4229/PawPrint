import { createBrowserRouter } from 'react-router-dom';
import SignIn from './components/SignIn';
import PetSelectionPage from './components/ProfileSelection';
import PetProfile from './components/PetProfile';
import Register from './components/Register';
import ProtectedRoute from './shared/context/ProtectedRoutes';
import HomePage from './components/HomePage';
import VetPortal from './components/VetPortal';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/petselection',
    element: (
      <ProtectedRoute>
        <PetSelectionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vetportal',
    element: (
      <ProtectedRoute>
        <VetPortal />
      </ProtectedRoute>
    ),
  },
  {
    path: '/petprofile/:petId',
    element: (
      <ProtectedRoute>
        <PetProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/register',
    element: <Register />,
  },
]);
