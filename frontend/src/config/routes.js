import React, { lazy } from 'react';
import AuthorizedRoute from '../pages/Auth/AuthorizedRoute';
import LoginRoute from '../pages/Auth/LoginRoute';
//Test delete later
import { Button, Typography, Paper } from '@mui/material';

const Landing = lazy(() => import('../pages/Landing/Landing'));
const Dashboard = lazy(() => import('../pages/Dashboard/Dashboard'));

const AppBar = lazy(() => import('../components/AppBar/AppBar'));
const Signin = lazy(() => import('../components/Signin/Signin'));

const routes = [
    {
        path: '/',
        exact: true,
        component: (
            <Landing />
        )
    },
    {
        path: '/dashboard/*',
        exact: false,
        component: (
            <AuthorizedRoute>
                <Dashboard>
                    <AppBar />
                </Dashboard>
            </AuthorizedRoute>
        )
    },
    {
        path: 'dashboard/signin',
        exact: true,
        component: (
            <Signin />
        )
    },
    {
        path: '/login/:id',
        exact: false,
        component: (
            <LoginRoute />
        )
    }
];

export default routes;