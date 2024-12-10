import React from 'react';
import { useTable, Column } from 'react-table';
import './GroupDetailsTable.scss';

interface Employee {
    id: string;
    name: string;
    surname: string;
    holiday: number;
}

interface GroupDetailsTableProps {
    data: Employee[];
}

const GroupDetailsTable: React.FC<GroupDetailsTableProps> = ({ data }) => {
    const columns: Column<Employee>[] = React.useMemo(
        () => [
            {
                Header: 'Pracownik',
                accessor: (row: Employee) => `${row.name} ${row.surname}`, // Łączenie imienia i nazwiska w jedną kolumnę
            },
            {
                Header: 'Pozostałe dni urlopu',
                accessor: 'holiday', // Dostęp do holiday
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Employee>({
        columns,
        data,
    });

    console.log(data);

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
