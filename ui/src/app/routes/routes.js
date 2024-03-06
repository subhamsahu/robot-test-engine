import { lazy } from 'react';
import Loadable from '../components/Core/Loadable'
import AppLayout from '../components/AppLayout/AppLayout';

const NotFound = Loadable(lazy(() => import('../pages/404NotFound/PageNotFound')));

// dashboard page
const Dashboard = Loadable(lazy(() => import('../pages/Dashboard/Dashboard')));
const AdminLogin = Loadable(lazy(() => import('../pages/Auth/AdminLogin')));
const Config = Loadable(lazy(() => import('../pages/TestFramework//Config/Config')));
const Data = Loadable(lazy(() => import('../pages/TestFramework/Testdata/Data')));
const Tests = Loadable(lazy(() => import('../pages/TestFramework/Tests/Tests_Vertical_View')));
const Suite = Loadable(lazy(() => import('../pages/TestFramework/Suite/Suite')));
const Testplan = Loadable(lazy(() => import('../pages/TestFramework/Testplan/Testplan')));
const Logs = Loadable(lazy(() => import('../pages/TestFramework/Logs/Logs')));
const DefectManagement = Loadable(lazy(() => import('../pages/DefectManagement/DefectManagement')));
const Settings = Loadable(lazy(() => import('../pages/Settings/Settings')));

const routes = [
    {
        path: '/',
        element:
            <AppLayout>
                <Dashboard />
            </AppLayout>
    },
    {
        path: '/testframework/config',
        element:
            <AppLayout>
                <Config />
            </AppLayout>
    },
    {
        path: '/testframework/data',
        element:
            <AppLayout>
                <Data />
            </AppLayout>
    },
    {
        path: '/testframework/tests',
        element:
            <AppLayout>
                <Tests />
            </AppLayout>
    },
    {
        path: '/testframework/suite',
        element:
            <AppLayout>
                <Suite />
            </AppLayout>
    },
    {
        path: '/testframework/testplan',
        element:
            <AppLayout>
                <Testplan />
            </AppLayout>
    },
    {
        path: '/testframework/logs',
        element:
            <AppLayout>
                <Logs />
            </AppLayout>
    },
    {
        path: '/defectmanagement',
        element:
            <AppLayout>
                <DefectManagement />
            </AppLayout>
    },
    {
        path: '/settings',
        element:
            <AppLayout>
                <Settings />
            </AppLayout>
    },
    {
        path: '/session/login',
        element:
            <AdminLogin />
    },
    { path: '*', element: <AppLayout><NotFound /></AppLayout> }
];


export default routes;