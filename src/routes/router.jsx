import { createBrowserRouter, Navigate } from 'react-router-dom';

//TODO Imlement Lazy load

import App from '../App.jsx';

import AuthLayout from '../layouts/AuthLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AdminsLayout from '../layouts/AdminsLayout.jsx';

import Login from '../pages/auth/Login.jsx';

import GlobalError from '../Pages/error/GlobalError.jsx';
import NotFound from '../pages/error/NotFound.jsx';
import Unauthorized from '../pages/error/Unauthorized.jsx';

import About from '../pages/public/About.jsx';
import Home from '../pages/public/Home.jsx';

import Dashboard from '../pages/admin/Dashboard.jsx';
import Users from '../pages/admin/users/Users.jsx';
import Media from '../pages/admin/media/Media.jsx';
import Posts from '../pages/admin/posts/Posts.jsx';
import CreatePost from '../pages/admin/posts/CreatePost.jsx';
import EditPost from '../pages/admin/posts/EditPost.jsx';
import Pages from '../pages/admin/pages/Pages.jsx';
import CreatePage from '../pages/admin/pages/CreatePage.jsx';
import EditPage from '../pages/admin/pages/EditPage.jsx';

import { ROLES } from '../config/roles.js';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <GlobalError />,
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

      // 3. Protected Admin Routes
      {
        path: 'admin',
        element: (
          <AuthLayout
            authentication={true}
            roles={[ROLES.ADMIN, ROLES.MANAGER]}
          />
        ),
        children: [
          {
            element: <AdminsLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: 'dashboard', element: <Dashboard /> },
              { path: 'users', element: <Users /> },
              { path: 'media', element: <Media /> },
              { path: 'posts', element: <Posts /> },
              { path: 'posts/create', element: <CreatePost /> },
              { path: 'posts/edit/:id', element: <EditPost /> },
              { path: 'pages', element: <Pages /> },
              { path: 'pages/create', element: <CreatePage /> },
              { path: 'pages/edit/:id', element: <EditPage /> },
            ],
          },
        ],
      },

      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },

      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
