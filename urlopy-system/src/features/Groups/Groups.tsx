import React, { useEffect, useState } from 'react';
import GroupsTable from '../../components/GroupsTable/GroupsTable';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './Groups.scss';

interface Group {
    groupId: string;
    groupName: string;
    leaderId: string;
    leaderName: string;
    leaderSurname: string;
    employeeCount: number;
}

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

const Groups: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setLoading(true);
                setError(null);

                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const decodedToken: DecodedToken = jwtDecode(accessToken);
                setUserRole(decodedToken.role); // Ustawienie roli użytkownika

                const response = await fetch('http://localhost:5000/group/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych o grupach.');
                }

                const responseData = await response.json();
                const groupsData: Group[] = JSON.parse(responseData.message);
                setGroups(groupsData);
            } catch (error: any) {
                console.error('Błąd podczas pobierania grup:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    const handleAddGroup = () => {
        alert('Dodawanie nowej grupy nie jest jeszcze zaimplementowane.');
    };

    return (
        <div className="groups">
            <div className="header-wrapper">
                <h1>Grupy</h1>
                <button 
                    className="add-group-button" 
                    onClick={handleAddGroup} 
                    disabled={userRole === 'team_leader'}
                >
                    Dodaj grupę
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <p>Ładowanie danych...</p>
            ) : (
                <GroupsTable data={groups} />
            )}
        </div>
    );
};

export default Groups;
