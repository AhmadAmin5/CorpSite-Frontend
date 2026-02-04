import { createBrowserRouter, Navigate } from 'react-router-dom';

import App from '../App.jsx';
import GlobalError from '../pages/error/GlobalError.jsx';

import { ROLES } from '../config/roles.js';

const lazyLoad = (importFunc) => async () => {
  const module = await importFunc();
  return { Component: module.default };
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <GlobalError />,
    children: [
      // 1. Public Routes
      {
        lazy: lazyLoad(() => import('../layouts/PublicLayout.jsx')),
        children: [
          {
            path: '/',
            lazy: lazyLoad(() => import('../pages/public/Home.jsx'))
          },
          {
            path: 'about',
            lazy: lazyLoad(() => import('../pages/public/About.jsx'))
          },
        ],
      },

      // 2. Auth Routes (Login)
      {
        path: 'login',
        lazy: async () => {
          const { default: AuthLayout } = await import('../layouts/AuthLayout.jsx');
          const { default: Login } = await import('../pages/auth/Login.jsx');

          return {
            Component: () => (
              <AuthLayout authentication={false}>
                <Login />
              </AuthLayout>
            )
          };
        },
      },

      // 3. Protected Admin Routes
      {
        path: 'admin',
        lazy: async () => {
          const { default: AuthLayout } = await import('../layouts/AuthLayout.jsx');
          return {
            Component: () => (
              <AuthLayout
                authentication={true}
                roles={[ROLES.ADMIN, ROLES.MANAGER]}
              />
            )
          };
        },
        children: [
          {
            lazy: lazyLoad(() => import('../layouts/AdminsLayout.jsx')),
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },

              {
                path: 'dashboard',
                lazy: lazyLoad(() => import('../pages/admin/Dashboard.jsx'))
              },
              {
                path: 'users',
                lazy: lazyLoad(() => import('../pages/admin/users/Users.jsx'))
              },
              {
                path: 'media',
                lazy: lazyLoad(() => import('../pages/admin/media/Media.jsx'))
              },
              {
                path: 'posts',
                lazy: lazyLoad(() => import('../pages/admin/posts/Posts.jsx'))
              },
              {
                path: 'posts/create',
                lazy: lazyLoad(() => import('../pages/admin/posts/CreatePost.jsx'))
              },
              {
                path: 'posts/edit/:id',
                lazy: lazyLoad(() => import('../pages/admin/posts/EditPost.jsx'))
              },
              {
                path: 'pages',
                lazy: lazyLoad(() => import('../pages/admin/pages/Pages.jsx'))
              },
              {
                path: 'pages/create',
                lazy: lazyLoad(() => import('../pages/admin/pages/CreatePage.jsx'))
              },
              {
                path: 'pages/edit/:id',
                lazy: lazyLoad(() => import('../pages/admin/pages/EditPage.jsx'))
              },
            ],
          },
        ],
      },

      {
        path: 'unauthorized',
        lazy: lazyLoad(() => import('../pages/error/Unauthorized.jsx')),
      },

      {
        path: '*',
        lazy: lazyLoad(() => import('../pages/error/NotFound.jsx')),
      },
    ],
  },
]);

export default router;