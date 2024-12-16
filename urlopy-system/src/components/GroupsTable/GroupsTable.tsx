import React from 'react';
import { useTable, Column } from 'react-table';
import { useNavigate } from 'react-router-dom';
import './GroupsTable.scss';

interface Group {
    groupId: string;
    groupName: string;
    leaderId: string;
    leaderName: string;
    leaderSurname: string;
    employeeCount: number;
}

interface GroupsTableProps {
    data: Group[];
}

const GroupsTable: React.FC<GroupsTableProps> = ({ data }) => {
    const navigate = useNavigate();

    const columns: Column<Group>[] = React.useMemo(
        () => [
            {
                Header: 'Nazwa grupy',
                accessor: 'groupName',
            },
            {
                Header: 'Lider grupy',
                accessor: (row) => `${row.leaderName} ${row.leaderSurname}`, 
            },
            {
                Header: 'Liczba pracowników',
                accessor: 'employeeCount', 
            },
        ],
        []
    );

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable<Group>({
        columns,
        data,
    });

    return (
        <table {...getTableProps()} className="groups-table">
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
                        <tr
                            {...row.getRowProps()}
                            onClick={() => navigate(`/groups/${row.original.groupId}`)} 
                            className="clickable-row"
                        >
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

export default GroupsTable;
