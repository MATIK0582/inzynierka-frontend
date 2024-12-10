import React, { useEffect, useState } from 'react';
import EmployeesTable from '../../components/EmployeesTable/EmployeesTable';
import mockEmployeesData from '../../mocks/new_employees.json';
import './Employees.scss';

interface Employee {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    groupName: string;
    holidays: number;
}

const Employees: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        // Symulacja pobierania danych z pliku mock
        setEmployees(mockEmployeesData as Employee[]);
    }, []);

    return (
        <div className="employees">
            <div className="header-wrapper">
                <h1>Pracownicy</h1>
                <button className="add-employee-button" onClick={() => alert('Dodawanie nowego pracownika nie jest jeszcze zaimplementowane.')}>
                    Dodaj pracownika
                </button>
            </div>
            <EmployeesTable data={employees} />
        </div>
    );
};

export default Employees;
