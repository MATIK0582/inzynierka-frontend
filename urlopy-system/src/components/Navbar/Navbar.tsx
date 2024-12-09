import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Roles } from '../../utils/roles';
import Cookies from 'js-cookie';
import './Navbar.scss';

const Navbar: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        Cookies.remove('access_token');
        navigate('/login');
    };

    const renderLinks = () => {
        if (!user) return null;

        let links: { path: string; label: string }[] = [];

        switch (user.role) {
            case Roles.USER:
                links = [
                    { path: '/profile', label: 'Profil' },
                    { path: '/vacations', label: 'Urlopy' },
                    { path: '/', label: 'Kalendarz' },
                ];
                break;
            case Roles.TEAM_LEADER:
            case Roles.HUMAN_RESOURCE:
            case Roles.ADMIN:
                links = [
                    { path: '/employees', label: 'Pracownicy' },
                    { path: '/groups', label: 'Grupy' },
                    { path: '/vacations', label: 'Urlopy' },
                    { path: '/', label: 'Kalendarz' },
                ];
                break;
            default:
                break;
        }

        return links.map((link) => (
            <li key={link.path} className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}>
                <Link to={link.path} className="nav-link">
                    {link.label}
                </Link>
            </li>
        ));
    };

    return (
        <nav className="navbar">
            <div className="navbar-content">
                {user && (
                    <Link to="/profile" className="navbar-greeting">
                        Witaj, <span className="user-name">Mateusz!</span>
                    </Link>
                )}
                <ul className="nav-links">
                    {renderLinks()}
                    {user && (
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link logout">
                                Wyloguj się
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
