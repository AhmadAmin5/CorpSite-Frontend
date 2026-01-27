import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from '../layouts/AuthLayout.jsx';
import Adminslayout from '../layouts/AdminsLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminPanelLayout from '../layouts/AdminPanelLayout.jsx';


// TODO Implement Lazyload

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
      //Public
      {
        element: <PublicLayout />,
        children: [
          {
            path: '/',
            element: <Home />,
          },
          {
            path: 'about',
            element: <About />,
          },
        ],
      },

      //Admins
      {
        element: <Adminslayout />,
        children: [
          //Public
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

          //Private
          {
            element: (
              <AuthLayout authentication={true} roles={['admin', 'manager']} />
            ),
            children: [
              {
                path: 'admin',
                element: <AdminPanelLayout />,
                children: [
                  {
                    index: true,
                    element: <Dashboard />,
                  },
                  {
                    path: 'dashboard',
                    element: <Dashboard />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
