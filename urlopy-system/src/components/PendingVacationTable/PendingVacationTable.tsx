import React, { useMemo } from 'react';
import { useTable, useSortBy, Column } from 'react-table';
import './PendingVacationTable.scss';

interface PendingVacationTableProps {
    data: Array<{
        name: string;
        surname: string;
        startDate: string;
        endDate: string;
        holidayType: string;
        status?: string;
    }>;
    columns: string[];
    onRowClick?: (holiday: any) => void;
}

const PendingVacationTable: React.FC<PendingVacationTableProps> = ({ data, columns, onRowClick }) => {
    const formattedColumns: Column<any>[] = useMemo(() => {
        return columns.map((col) => ({
            Header: col,
            accessor: (row) => {
                switch (col) {
                    case 'Pracownik':
                        return `${row.name} ${row.surname}`;
                    case 'Data rozpoczęcia':
                        return row.startDate;
                    case 'Data zakończenia':
                        return row.endDate;
                    case 'Typ urlopu':
                        return row.holidayType;
                    case 'Status':
                        return row.status;
                    default:
                        return row[col] || '';
                }
            },
        }));
    }, [columns]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns: formattedColumns,
            data,
        },
        useSortBy,
    );

    return (
        <table {...getTableProps()} className="pending-vacation-table">
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()} key={column.id}>
                                {column.render('Header')}
                            </th>
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
                            onClick={() => onRowClick && onRowClick(row.original)} // Obsługa kliknięcia w wiersz
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

export default PendingVacationTable;
