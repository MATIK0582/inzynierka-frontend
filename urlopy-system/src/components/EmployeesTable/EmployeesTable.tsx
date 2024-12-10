import React from 'react';
import { useTable, Column } from 'react-table';
import './EmployeesTable.scss';

interface Employee {
    id: string;
    name: string;
    surname: string;
    email: string;
    role: string;
    groupName: string;
    holidays: number;
}

interface EmployeesTableProps {
    data: Employee[];
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ data }) => {
    const columns: Column<Employee>[] = React.useMemo(
        () => [
            {
                Header: 'Pracownik',
                accessor: (row) => `${row.name} ${row.surname}`, // Łączy imię i nazwisko
            },
            {
                Header: 'Grupa',
                accessor: 'groupName', // Poprawiamy accessor, aby był typem klucza obiektu Employee
            },
            {
                Header: 'Wykorzystane urlopy',
                accessor: 'holidays', // Poprawiamy accessor, aby był typem klucza obiektu Employee
            },
            {
                Header: 'Rola',
                accessor: 'role', // Poprawiamy accessor, aby był typem klucza obiektu Employee
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Employee>({
        columns,
        data,
    });

    return (
        <table {...getTableProps()} className="employees-table">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default EmployeesTable;
