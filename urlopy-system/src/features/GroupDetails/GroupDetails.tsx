import React, { useEffect, useState } from 'react';
import GroupDetailsTable from '../../components/GroupDetailsTable/GroupDetailsTable';
import Cookies from 'js-cookie';
import AddEmployeeToGroupModal from '../../components/AddEmployeeToGroupModal/AddEmployeeToGroupModal';
import RemoveEmployeeFromGroupModal from '../../components/RemoveEmployeeFromGroupModal/RemoveEmployeeFromGroupModal';
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
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);

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
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ groupId }),
            });

            if (!response.ok) {
                throw new Error('Nie udało się pobrać danych o szczegółach grupy.');
            }

            const responseData = await response.json();
            const employeesData: Employee[] = JSON.parse(responseData.message);

            const leader = employeesData.find((employee) => employee.role === 'team_leader');
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

    const handleDeleteGroup = async () => {
        const confirmation = window.confirm('Czy na pewno chcesz usunąć tę grupę? Tego działania nie można cofnąć.');
        if (!confirmation) return;

        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

            const response = await fetch('http://localhost:5000/group/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ groupId }),
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć grupy.');
            }

            alert('Grupa została usunięta.');
            window.location.href = '/groups';
        } catch (error: any) {
            alert('Wystąpił błąd podczas usuwania grupy.');
        }
    };

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
                    <h1>Grupa: {employees[0]?.groupName}</h1>

                    <div className="header-wrapper">
                        <h4>Lider zespołu: {leaderName}</h4>

                        <div className="button-wrapper">
                            <button
                                className="add-employee-button"
                                onClick={() => setIsModalOpen(true)}
                                disabled={userRole === 'team_leader'}
                            >
                                Dodaj pracownika
                            </button>

                            <button
                                className="remove-employee-button"
                                onClick={() => setIsRemoveModalOpen(true)}
                                disabled={userRole === 'team_leader'}
                            >
                                Usuń pracownika
                            </button>

                            <button
                                className="delete-group-button"
                                onClick={handleDeleteGroup}
                                disabled={userRole === 'team_leader'}
                            >
                                Usuń grupę
                            </button>
                        </div>
                    </div>

                    <GroupDetailsTable data={employees} />

                    {isModalOpen && (
                        <AddEmployeeToGroupModal
                            groupId={groupId}
                            onEmployeeAdded={fetchGroupDetails}
                            onClose={() => setIsModalOpen(false)}
                        />
                    )}

                    {isRemoveModalOpen && (
                        <RemoveEmployeeFromGroupModal
                            isOpen={isRemoveModalOpen}
                            groupId={groupId}
                            employees={employees.filter((emp) => emp.role !== 'team_leader')}
                            onEmployeeRemoved={fetchGroupDetails}
                            onClose={() => setIsRemoveModalOpen(false)}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default GroupDetails;
