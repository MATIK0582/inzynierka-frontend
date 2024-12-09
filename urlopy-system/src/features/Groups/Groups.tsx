import React, { useEffect, useState } from 'react';
import GroupsTable from '../../components/GroupsTable/GroupsTable';
import mockGroupsData from '../../mocks/mock_groups.json';
import './Groups.scss';

interface Group {
    id: string;
    name: string;
    leaderId: string;
    numberOfEmployees: number;
}

const Groups: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        // Symulacja pobierania danych z pliku mock
        setGroups(mockGroupsData as Group[]);
    }, []);

    const handleAddGroup = () => {
        alert('Dodawanie nowej grupy nie jest jeszcze zaimplementowane.');
    };

    return (
        <div className="groups">
            <div className="header-wrapper">
                <h1>Grupy</h1>
                <button className="add-group-button" onClick={handleAddGroup}>
                    Dodaj grupę
                </button>
            </div>
            <GroupsTable data={groups} />
        </div>
    );
};

export default Groups;
