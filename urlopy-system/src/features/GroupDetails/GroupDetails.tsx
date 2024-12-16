import React, { useEffect, useState } from 'react';
import GroupDetailsTable from '../../components/GroupDetailsTable/GroupDetailsTable';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './GroupDetails.scss';

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

interface GroupDetailsProps {
    groupId: string;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ groupId }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [leaderName, setLeaderName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroupDetails = async () => {
            try {
                setLoading(true);
                setError(null);

                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const decodedToken: DecodedToken = jwtDecode(accessToken);
                setUserRole(decodedToken.role);

                const response = await fetch('http://localhost:5000/user/data/group', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ groupId }), 
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych o szczegółach grupy.');
                }

                const responseData = await response.json();
                const employeesData: Employee[] = JSON.parse(responseData.message);

                // Wybieranie lidera grupy spośród pracowników
                const leader = employeesData.find(employee => employee.role === 'team_leader');
                if (leader) {
                    setLeaderName(`${leader.name} ${leader.surname}`);
                }

                setEmployees(employeesData);
            } catch (error: any) {
                console.error('Błąd podczas pobierania szczegółów grupy:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroupDetails();
    }, [groupId]);

    const handleAddEmployee = () => {
        alert('Dodawanie nowego pracownika do grupy nie jest jeszcze zaimplementowane.');
    };

    return (
        <div className="group-details">
            {loading ? (
                <h1>Ładowanie szczegółów grupy...</h1>
            ) : error ? (
                <h1 className="error-message">{error}</h1>
            ) : (
                <>
                    <h1>Grupa: {employees[0]?.groupName}</h1>

                    <div className="header-wrapper">
                        <h4>Lider zespołu: {leaderName}</h4>
                        <button 
                            className="add-employee-button" 
                            onClick={handleAddEmployee} 
                            disabled={userRole === 'team_leader'}
                        >
                            Dodaj pracownika
                        </button>
                    </div>

                    <GroupDetailsTable data={employees} />
                </>
            )}
        </div>
    );
};

export default GroupDetails;
