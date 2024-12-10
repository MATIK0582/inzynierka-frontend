import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Employees from '../../features/Employees/Employees';
import './EmployeesPage.scss';

const EmployeesPage: React.FC = () => {
    return (
        <div className="employees-page">
            <Navbar />
            <main className="main-content">
                <Employees />
            </main>
        </div>
    );
};

export default EmployeesPage;
