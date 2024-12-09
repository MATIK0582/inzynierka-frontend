import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { Roles } from '../utils/roles';

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles: Roles[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: location } });
        } else if (!allowedRoles.includes(user.role)) {
            navigate('/');
        }
    }, [user, allowedRoles, navigate, location]);

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
