import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { LoadingSpinner } from '@/core/components/loading-spinner';
import { MainLayout } from '@/layouts/MainLayout';

const HomePage = lazy(() =>
  import('@/pages/Home').then((module) => ({ default: module.HomePage }))
);
const RegisterPage = lazy(() =>
  import('@/pages/Register').then((module) => ({ default: module.RegisterPage }))
);
const LoginPage = lazy(() =>
  import('@/pages/Login').then((module) => ({ default: module.LoginPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((module) => ({ default: module.NotFoundPage }))
);

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense
        fallback={
          <div className="flex h-screen w-screen items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: '*',
        element: (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <LoadingSpinner />
              </div>
            }
          >
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export { routes };
