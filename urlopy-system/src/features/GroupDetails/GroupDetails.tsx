import React, { useEffect, useState } from 'react';
import GroupDetailsTable from '../../components/GroupDetailsTable/GroupDetailsTable';
import mockEmployeesData from '../../mocks/mock_employees.json';
import './GroupDetails.scss';

interface Employee {
    id: string;
    name: string;
    surname: string;
    holiday: number;
}

interface GroupDetailsProps {
    groupId: string;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ groupId }) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [leaderName, setLeaderName] = useState<string>('');

    useEffect(() => {
        setEmployees(mockEmployeesData as Employee[]);
        const mockLeaderName = 'Jan Kowalski';
        setLeaderName(mockLeaderName);
    }, [groupId]);

    const handleAddEmployee = () => {
        alert('Dodawanie nowego pracownika do grupy nie jest jeszcze zaimplementowane.');
    };

    return (
        <div className="group-details">
            <h1>Grupa {groupId}</h1>

            <div className="header-wrapper">
                <h4>Lider zespołu: {leaderName}</h4>
                <button className="add-employee-button" onClick={handleAddEmployee}>
                    Dodaj pracownika
                </button>
            </div>

            <GroupDetailsTable data={employees} />
        </div>
    );
};

export default GroupDetails;
