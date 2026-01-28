import { createBrowserRouter, Navigate } from 'react-router-dom';

//TODO Imlement Lazy load

import App from '../App.jsx';

import { Unauthorized } from '../components';

import AuthLayout from '../layouts/AuthLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminsLayout from '../layouts/AdminsLayout.jsx';

import Login from '../pages/auth/Login.jsx';

import About from '../pages/public/About.jsx';
import Home from '../pages/public/Home.jsx';

import Dashboard from '../pages/admin/Dashboard.jsx';
import Users from '../pages/admin/Users.jsx';

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
        element: (
          <AuthLayout authentication={true} roles={['admin', 'manager']} />
        ),
        children: [
          {
            element: <AdminsLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <Dashboard /> },
              { path: 'users', element: <Users /> },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
