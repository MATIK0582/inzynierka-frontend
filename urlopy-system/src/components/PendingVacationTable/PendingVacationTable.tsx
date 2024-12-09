import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, Column } from 'react-table';
import Cookies from 'js-cookie';
import './PendingVacationTable.scss';

interface PendingVacationTableProps {
    data: Array<{
        id: string;
        userId: string;
        startDate: string;
        endDate: string;
        description: string;
        holidayType: string;
        status: string;
        createdAt: string;
        updatedAt: string;
        name: string;
        surname: string;
    }>;
    columns: string[];
    onRowClick?: (holiday: any) => void;
}

const PendingVacationTable: React.FC<PendingVacationTableProps> = ({ data, columns, onRowClick }) => {
    const [localData, setLocalData] = useState(data); // Przechowywanie lokalnego stanu tabeli

    // console.log(data);

    const handleAcceptHoliday = async (id: string) => {
        const confirmAction = window.confirm('Czy na pewno chcesz zaakceptować ten urlop?');
        if (!confirmAction) return;

        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

            const response = await fetch('http://localhost:5000/holiday/accept', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ holidayId:  id}),
            });

            if (!response.ok) {
                throw new Error('Nie udało się zaakceptować urlopu.');
            }

            alert('Urlop został zaakceptowany.');
            setLocalData((prevData) => prevData.filter((holiday) => holiday.id !== id)); // Usunięcie wiersza z tabeli
        } catch (error: any) {
            alert(`Wystąpił błąd podczas akceptacji urlopu: ${error.message || 'Nieznany błąd.'}`);
        }
    };

    const handleRejectHoliday = async (id: string) => {
        const confirmAction = window.confirm('Czy na pewno chcesz odrzucić ten urlop?');
        if (!confirmAction) return;

        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

            const response = await fetch('http://localhost:5000/holiday/reject', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ holidayId: id }),
            });

            if (!response.ok) {
                throw new Error('Nie udało się odrzucić urlopu.');
            }

            alert('Urlop został odrzucony.');
            setLocalData((prevData) => prevData.filter((holiday) => holiday.id !== id));
        } catch (error: any) {
            alert(`Wystąpił błąd podczas odrzucania urlopu: ${error.message || 'Nieznany błąd.'}`);
        }
    };

    const formattedColumns: Column<any>[] = useMemo(() => {
        const filteredColumns = columns.filter(col => col !== 'Status');

        const baseColumns: Column<any>[] = filteredColumns.map((col) => ({
            Header: col,
            accessor: (row: Record<string, any>) => {
                switch (col) {
                    case 'Pracownik':
                        return `${row.name} ${row.surname}`;
                    case 'Data rozpoczęcia':
                        return row.startDate;
                    case 'Data zakończenia':
                        return row.endDate;
                    case 'Typ urlopu':
                        return row.holidayType;
                    default:
                        return row[col] || '';
                }
            },
        }));

        baseColumns.push({
            Header: 'Akcja',
            accessor: 'action',
            Cell: ({ row }: { row: any }) => (
                <div className="action-buttons">
                    <button 
                        className="accept-button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptHoliday(row.original.id);
                        }}
                    >
                        Akceptuj
                    </button>
                    <button 
                        className="reject-button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRejectHoliday(row.original.id);
                        }}
                    >
                        Odrzuć
                    </button>
                </div>
            ),
        });

        return baseColumns;
    }, [columns]);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
        {
            columns: formattedColumns,
            data: localData,
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
                            onClick={() => onRowClick && onRowClick(row.original)} 
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
