import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '../components';
import App from '../App.jsx';

import { Loading } from '../components';

const Login = lazy(() => import('../pages/Login.jsx'));
const Unauthorized = lazy(() => import('../pages/Unauthorized.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          </AuthLayout>
        ),
      },

      {
        path: '/unauthorized',
        element: (
          <Suspense fallback={<Loading />}>
            <Unauthorized />
          </Suspense>
        ),
      },
    ],
  },
]);

export default router;
