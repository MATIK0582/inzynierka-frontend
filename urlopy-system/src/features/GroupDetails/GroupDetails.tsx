import React, { useEffect, useState } from 'react';
import GroupDetailsTable from '../../components/GroupDetailsTable/GroupDetailsTable';
import Cookies from 'js-cookie';
import AddEmployeeToGroupModal from '../../components/AddEmployeeToGroupModal/AddEmployeeToGroupModal';
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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    /**
     * Funkcja pobierająca szczegóły grupy oraz pracowników z grupy
     */
    const fetchGroupDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

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
            } else {
                setLeaderName('Brak lidera');
            }

            setEmployees(employeesData);
        } catch (error: any) {
            setError('Nie udało się pobrać szczegółów grupy.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Efekt uruchamiany podczas montowania komponentu
     */
    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        if (!accessToken) return;

        const decodedToken: DecodedToken = jwtDecode(accessToken);
        setUserRole(decodedToken.role);
        
        fetchGroupDetails();
    }, [groupId]);

    return (
        <div className="group-details">
            {loading ? (
                <h1>Ładowanie szczegółów grupy...</h1>
            ) : error ? (
                <h1 className="error-message">{error}</h1>
            ) : (
                <>
                    {/* Nazwa grupy */}
                    <h1>Grupa: {employees[0]?.groupName}</h1>

                    <div className="header-wrapper">
                        {/* Lider grupy */}
                        <h4>Lider zespołu: {leaderName}</h4>

                        {/* Przycisk dodawania pracownika */}
                        <button 
                            className="add-employee-button" 
                            onClick={() => setIsModalOpen(true)} 
                            disabled={userRole === 'team_leader'}
                        >
                            Dodaj pracownika
                        </button>
                    </div>

                    {/* Tabela z pracownikami */}
                    <GroupDetailsTable data={employees} />

                    {/* Modal dodawania pracownika */}
                    {isModalOpen && (
                        <AddEmployeeToGroupModal 
                            groupId={groupId} 
                            onEmployeeAdded={fetchGroupDetails} 
                            onClose={() => setIsModalOpen(false)} 
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default GroupDetails;
