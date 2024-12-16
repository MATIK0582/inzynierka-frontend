import React, { useEffect, useState } from 'react';
import EmployeesTable from '../../components/EmployeesTable/EmployeesTable';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import AddEmployeeModal from '../../components/AddEmployeeModal/AddEmployeeModal';
import './Employees.scss';

interface Employee {
    userId: string;
    name: string;
    surname: string;
    role: string;
    groupId: string;
    groupName: string;
    holidays: number;
    holidaysUponRequest: number;
}

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState<boolean>(false);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);

            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

            const decodedToken: DecodedToken = jwtDecode(accessToken);
            const userRole = decodedToken.role;

            const endpoint = 
                userRole === 'team_leader' 
                    ? 'http://localhost:5000/user/data/group' 
                    : 'http://localhost:5000/user/data/all';

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych o pracownikach.');
            }

            const responseData = await response.json();
            const employeesData: Employee[] = JSON.parse(responseData.message);

            setEmployees(employeesData);
        } catch (error: any) {
            console.error('Błąd podczas pobierania pracowników:', error);
            setError(error.message || 'Wystąpił nieznany błąd.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddEmployeeSuccess = () => {
        setIsAddEmployeeModalOpen(false);
        fetchEmployees();
    };

    return (
        <div className="employees">
            <div className="header-wrapper">
                <h1>Pracownicy</h1>
                <button 
                    className="add-employee-button" 
                    onClick={() => setIsAddEmployeeModalOpen(true)}
                >
                    Dodaj pracownika
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <p>Ładowanie danych...</p>
            ) : (
                <EmployeesTable data={employees} />
            )}

            {isAddEmployeeModalOpen && (
                <AddEmployeeModal 
                    isOpen={isAddEmployeeModalOpen} 
                    onClose={() => setIsAddEmployeeModalOpen(false)} 
                    onSuccess={handleAddEmployeeSuccess} 
                />
            )}
        </div>
    );
};

export default Employees;
