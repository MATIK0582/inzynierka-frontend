import { jwtDecode, JwtPayload } from 'jwt-decode';
import Cookies from 'js-cookie';

import { Roles } from '../utils/roles';

interface User {
    id: string;
    role: Roles;
}

const useAuth = () => {
    const token = Cookies.get('access_token');

    if (!token) {
        console.warn('Access token not found.');
        return { user: null };
    }

    try {
        const decoded = jwtDecode<JwtPayload & User>(token);

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
            console.warn('Token expired.');
            Cookies.remove('access_token');
            return { user: null };
        }

        const user: User = {
            id: decoded.id as string,
            role: decoded.role as Roles,
        };
        return { user };
    } catch (error) {
        console.error('Error decoding token:', error);
        return { user: null };
    }
};

export default useAuth;
