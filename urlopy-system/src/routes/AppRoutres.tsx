import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../features/Auth/Login';
import Register from '../features/Auth/Register';
import HomePage from '../pages/HomePage/HomePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import VacationsPage from '../pages/Vacations/VacationPage';
import PendingVacationsPage from '../pages/Vacations/PendingVacationsPage';
import GroupPage from '../pages/Groups/GroupPage';
import ProtectedRoute from '../components/ProtectedRoute';
import { Roles } from '../utils/roles';
import GroupDetailsPage from '../pages/GroupDetails/GroupDetailsPage';
import EmployeesPage from '../pages/Employee/EmployeesPage';
import UserVacationsPage from '../pages/UserVacations/UserVacationPage';
import EmployeeDetailsPage from '../pages/EmployeeDetails/EmployeeDetailsPage';

const AppRoutes = () => (
    <Router basename="/">
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/user-vacations"
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <UserVacationsPage />
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
            <Route
                path="/groups"
                element={
                    <ProtectedRoute allowedRoles={[Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <GroupPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/groups/:id"
                element={
                    <ProtectedRoute allowedRoles={[Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <GroupDetailsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/employees"
                element={
                    <ProtectedRoute allowedRoles={[Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <EmployeesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/employees/:id"
                element={
                    <ProtectedRoute allowedRoles={[Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <EmployeeDetailsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                index
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
        </Routes>
    </Router>
);

export default AppRoutes;
