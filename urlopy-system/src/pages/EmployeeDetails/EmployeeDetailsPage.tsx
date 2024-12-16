import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import EmployeeDetails from '../../features/EmployeeDetails/EmployeeDetails';
import { useParams } from 'react-router-dom';
import './EmployeeDetailsPage.scss';

const EmployeeDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="employee-details-page">
            <Navbar />
            <main className="main-content">
                {id ? (
                    <EmployeeDetails employeeId={id} />
                ) : (
                    <p>Nie znaleziono ID pracownika.</p>
                )}
            </main>
        </div>
    );
};

export default EmployeeDetailsPage;
