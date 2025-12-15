import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../utils/cookies';

export default function AuthGuard({ children, requireAuth = true, redirectTo = '/' }) {
    const location = useLocation();
    const authenticated = isAuthenticated();

    if (requireAuth && !authenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!requireAuth && authenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
