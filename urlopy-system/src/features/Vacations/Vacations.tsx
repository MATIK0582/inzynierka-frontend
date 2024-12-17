import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VacationTable from '../../components/VacationTable/VacationTable';
import HolidayDetailsModal from '../../components/HolidayDetailsModal';
import Cookies from 'js-cookie';
import './Vacations.scss';

interface Holiday {
    id: string;
    userId: string;
    startDate: string;
    endDate: string;
    description: string | null;
    holidayType: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    surname: string;
}

const Vacations = () => {
    const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([]);
    const [acceptedHolidays, setAcceptedHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                setLoading(true);
                setError(null);

                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const response = await fetch('http://localhost:5000/holiday/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych o urlopach.');
                }

                const responseData = await response.json();
                const holidaysData: Holiday[] = JSON.parse(responseData.message);

                const today = new Date().toISOString().split('T')[0];
                const upcoming = holidaysData.filter(
                    (holiday) => holiday.status === 'accepted' && holiday.startDate > today
                );
                
                const accepted = holidaysData.filter((holiday) => holiday.status === 'accepted' && holiday.startDate <= today);

                setUpcomingHolidays(upcoming);
                setAcceptedHolidays(accepted);
            } catch (error: any) {
                console.error('Błąd podczas pobierania urlopów:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            } finally {
                setLoading(false);
            }
        };

        fetchHolidays();
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
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="vacation-page">
            <div className="header-wrapper">
                <button className="nav-button" onClick={() => navigate('/vacations/pending')}>
                    Oczekujące urlopy
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <p>Ładowanie danych...</p>
            ) : (
                <>
                    <section className="upcoming-holidays">
                        <h2>Nadchodzące urlopy</h2>
                        <VacationTable
                            data={upcomingHolidays}
                            columns={['Pracownik', 'Data rozpoczęcia', 'Data zakończenia', 'Typ urlopu']}
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
                        isOpen={isDetailsModalOpen}
                        holiday={selectedHoliday}
                        onClose={() => setIsDetailsModalOpen(false)}
                    />
                </>
            )}
        </div>
    );
};

export default Vacations;
