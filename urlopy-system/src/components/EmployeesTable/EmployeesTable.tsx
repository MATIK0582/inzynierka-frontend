import React from 'react';
import { useTable, Column } from 'react-table';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './EmployeesTable.scss';

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


interface EmployeesTableProps {
    data: Employee[];
}

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

const EmployeesTable: React.FC<EmployeesTableProps> = ({ data }) => {
    const navigate = useNavigate();
    const accessToken = Cookies.get('access_token');
    let loggedInUserId: string | null = null;

    if (accessToken) {
        const decodedToken: any = jwtDecode(accessToken); // Poprawione
        loggedInUserId = decodedToken?.id || null;
    }

    const columns: Column<Employee>[] = React.useMemo(
        () => [
            {
                Header: 'Pracownik',
                accessor: (row) => `${row.name} ${row.surname}`, 
            },
            {
                Header: 'Grupa',
                accessor: 'groupName', 
            },
            {
                Header: 'Dostępne urlopy',
                accessor: 'holidays', 
            },
            {
                Header: 'Rola',
                accessor: 'role', 
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Employee>({
        columns,
        data,
    });

    const handleRowClick = (employee: Employee) => {
        if (employee.userId === loggedInUserId) {
            navigate('/profile');
        } else {
            navigate(`/employees/${employee.userId}`);
        }
    };

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
                        <tr {...row.getRowProps()} onClick={() => handleRowClick(row.original)}>
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
