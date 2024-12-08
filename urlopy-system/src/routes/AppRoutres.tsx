import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../features/Auth/Login';
import Register from '../features/Auth/Register';
import HomePage from '../pages/HomePage/HomePage';
import Profile from '../features/Profile/Profile';
import ProtectedRoute from '../components/ProtectedRoute';
import VacationPage from '../pages/Vacations/Vacations';
import { Roles } from '../utils/roles';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/home"
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
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/vacations"
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <VacationPage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </Router>
);

export default AppRoutes;
