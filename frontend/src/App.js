import { createBrowserRouter } from 'react-router-dom';
import SignIn from './components/SignIn';
import PetSelectionPage from './components/ProfileSelection';
import PetProfile from './components/PetProfile';
import Register from './components/Register';
import ProtectedRoute from './shared/context/ProtectedRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
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
