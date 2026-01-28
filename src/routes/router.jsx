import { createBrowserRouter, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminsLayout from '../layouts/AdminsLayout.jsx';

//TODO Imlement Lazy load


import App from '../App.jsx';
import Login from '../pages/Login.jsx';
import About from '../pages/About.jsx';
import Home from '../pages/Home.jsx';
import Unauthorized from '../pages/Unauthorized.jsx';
import Dashboard from '../pages/Dashboard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // 1. Public Routes
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <Home /> },
          { path: 'about', element: <About /> },
        ],
      },

      // 2. Auth Routes (Login) - No Admin Layout
      {
        path: 'login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },

      // 3. Protected Admin Routes
      {
        path: 'admin',
        element: <AuthLayout authentication={true} roles={['admin', 'manager']} />,
        children: [
          {
            element: <AdminsLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <Dashboard /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;