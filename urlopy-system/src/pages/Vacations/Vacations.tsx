import React, { useEffect, useState } from 'react';
import VacationTable from '../../components/VacationTable/VacationTable';
import HolidayDetailsModal from '../../components/HolidayDetailsModal';
import holidaysData from '../../mocks/mock_holidays.json';
import './Vacations.scss';

interface Holiday {
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
}

const VacationPage = () => {
    const [pendingHolidays, setPendingHolidays] = useState<Holiday[]>([]);
    const [acceptedHolidays, setAcceptedHolidays] = useState<Holiday[]>([]);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const typedHolidaysData: Holiday[] = holidaysData as Holiday[];
        const pending = typedHolidaysData.filter((holiday) => holiday.status === 'pending');
        const accepted = typedHolidaysData.filter((holiday) => holiday.status === 'accepted');
        setPendingHolidays(pending);
        setAcceptedHolidays(accepted);
    }, []);

    const getMonthlyAcceptedHolidays = () => {
        const grouped: Record<string, Holiday[]> = {};

        acceptedHolidays.forEach((holiday) => {
            const monthKey = new Date(holiday.startDate).toLocaleDateString('pl-PL', {
                month: 'long',
                year: 'numeric',
            });
            if (!grouped[monthKey]) grouped[monthKey] = [];
            grouped[monthKey].push(holiday);
        });

        return Object.entries(grouped).map(([month, holidays]) => ({
            month,
            holidays,
        }));
    };

    const handleRowClick = (holiday: Holiday) => {
        setSelectedHoliday(holiday);
        setIsModalOpen(true);
    };

    return (
        <div className="vacation-page">
            <h1>Urlopy użytkownika</h1>

            <section className="pending-holidays">
                <h2>Oczekujące urlopy</h2>
                <VacationTable
                    data={pendingHolidays}
                    columns={['Pracownik', 'Data rozpoczęcia', 'Data zakończenia', 'Typ urlopu', 'Status']}
                    onRowClick={handleRowClick}
                />
            </section>

            <section className="accepted-holidays">
                <h2>Zrealizowane urlopy</h2>
                {getMonthlyAcceptedHolidays().map(({ month, holidays }) => (
                    <div key={month}>
                        <h3>{month}</h3>
                        <VacationTable
                            data={holidays}
                            columns={['Pracownik', 'Data rozpoczęcia', 'Data zakończenia', 'Typ urlopu']}
                            onRowClick={handleRowClick}
                        />
                    </div>
                ))}
            </section>

            <HolidayDetailsModal 
                isOpen={isModalOpen} 
                holiday={selectedHoliday} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};

export default VacationPage;
