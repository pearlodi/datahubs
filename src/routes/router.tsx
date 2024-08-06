/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter } from 'react-router-dom';
import MainLayout from 'layouts/main-layout';
import Splash from 'components/loading/Splash';
import PageLoader from 'components/loading/PageLoader';

const App = lazy(() => import('App'));
const Dashboard = lazy(() => import('pages/dashboard'));
const Table = lazy(() => import('pages/dashboard/table'));
const Visualize = lazy(() => import('pages/dashboard/visualize'));
const VisualizeTable = lazy(() => import('pages/dashboard/visualizeTable'));
const DataTable = lazy(() => import('pages/dashboard/dataTable'));
const CreateTable = lazy(() => import('pages/dashboard/createTable'));
const ManualTable = lazy(() => import('pages/dashboard/manualTable'));
const router = createBrowserRouter(
  [
    {
      element: (
        <Suspense fallback={<Splash />}>
          <App />
        </Suspense>
      ),
      children: [
        {
          path: '/',
          element: (
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </MainLayout>
          ),
          children: [
            {
              index: true,
              element: <Dashboard />,
            },{
              path: '/table',
              element: <Table />,
            },{
              path: '/visualize/:id',
              element: <Visualize />,
            },{
              path: '/data-table/:id',
              element: <DataTable />,
            },{
              path: '/create-table',
              element: <CreateTable />,
            },{
              path: '/manual-table/:id',
              element: <ManualTable />,
            },{
              path: '/visualize-table/:id',
              element: <VisualizeTable />,
            },
          ],
        },
       
      ],
    },
  ],
  {
    basename: '/datahub',
  },
);

export default router;
