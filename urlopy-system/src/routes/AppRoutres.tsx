import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../features/Auth/Login';
import Register from '../features/Auth/Register';
import HomePage from '../pages/HomePage/HomePage';
import ProtectedRoute from '../components/ProtectedRoute';
import ProfilePage from '../pages/Profile/ProfilePage';
import VacationsPage from '../pages/Vacations/VacationPage';
import PendingVacationsPage from '../pages/Vacations/PendingVacationsPage';
import { Roles } from '../utils/roles';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vacations"
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <VacationsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vacations/pending"
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <PendingVacationsPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </Router>
);

export default AppRoutes;
