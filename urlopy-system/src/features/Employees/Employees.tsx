import React, { useEffect, useState } from 'react';
import EmployeesTable from '../../components/EmployeesTable/EmployeesTable';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
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

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                setError(null);

                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                // Dekodowanie access tokena, aby uzyskać rolę użytkownika
                const decodedToken: DecodedToken = jwtDecode(accessToken);
                const userRole = decodedToken.role;

                // Wybór endpointu na podstawie roli użytkownika
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

        fetchEmployees();
    }, []);

    return (
        <div className="employees">
            <div className="header-wrapper">
                <h1>Pracownicy</h1>
                <button className="add-employee-button" onClick={() => alert('Dodawanie nowego pracownika nie jest jeszcze zaimplementowane.')}>
                    Dodaj pracownika
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <p>Ładowanie danych...</p>
            ) : (
                <EmployeesTable data={employees} />
            )}
        </div>
    );
};

export default Employees;
