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

    if (!user) {
        navigate('/login', { state: { from: location } });
        return null;
    }

    if (!allowedRoles.includes(user.role as Roles)) {
        navigate('/home');
        return null;
    }

    return children;
};

export default ProtectedRoute;
