import React from 'react';
import { useTable, Column } from 'react-table';

import './GroupDetailsTable.scss';

interface Employee {
    userId: string;
    name: string;
    surname: string;
    holidays: number;
    holidaysUponRequest: number;
}

interface GroupDetailsTableProps {
    data: Employee[];
}

const GroupDetailsTable: React.FC<GroupDetailsTableProps> = ({ data }) => {
    const columns: Column<Employee>[] = React.useMemo(
        () => [
            {
                Header: 'Pracownik',
                accessor: (row: Employee) => `${row.name} ${row.surname}`, 
            },
            {
                Header: 'Pozostałe dni urlopu',
                accessor: 'holidays', 
            },
            {
                Header: 'Urlopy na żądanie',
                accessor: 'holidaysUponRequest', 
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Employee>({
        columns,
        data,
    });

    return (
        <table {...getTableProps()} className="group-details-table">
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

export default GroupDetailsTable;
