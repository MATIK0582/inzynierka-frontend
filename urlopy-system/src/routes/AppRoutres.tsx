import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../features/Auth/Login";
import Register from "../features/Auth/Register";
import Callendar from "../features/Callendar/Callendar";
import Profile from "../features/Profile/Profile";
import ProtectedRoute from "../components/ProtectedRoute";
import { Roles } from "../utils/roles";

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/home"
                element={
                    <ProtectedRoute allowedRoles={[Roles.USER, Roles.TEAM_LEADER, Roles.HUMAN_RESOURCE, Roles.ADMIN]}>
                        <Callendar />
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
            {/* Dodaj pozostałe ścieżki z odpowiednimi rolami */}
        </Routes>
    </Router>
);

export default AppRoutes;
