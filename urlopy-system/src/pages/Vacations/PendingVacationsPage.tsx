import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import PendingVacationTable from '../../components/PendingVacationTable/PendingVacationTable';
import HolidayDetailsModal from '../../components/HolidayDetailsModal';
import Cookies from 'js-cookie';
import './PendingVacationsPage.scss';

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

const PendingVacationsPage = () => {
    const [pendingHolidays, setPendingHolidays] = useState<Holiday[]>([]);
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

                const pending = holidaysData.filter((holiday) => holiday.status === 'pending');
                setPendingHolidays(pending);
            } catch (error: any) {
                console.error('Błąd podczas pobierania urlopów:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            } finally {
                setLoading(false);
            }
        };

        fetchHolidays();
    }, []);

    const handleRowClick = (holiday: Holiday) => {
        setSelectedHoliday(holiday);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="pending-vacations-page">
            <Navbar />
            <main className="main-content">
                <div className="header-wrapper">
                    <h2>Oczekujące urlopy</h2>
                    <button className="nav-button" onClick={() => navigate('/vacations')}>
                        Zaakceptowane urlopy
                    </button>
                </div>

                <section className="pending-holidays-section">
                    {error && <div className="error-message">{error}</div>}

                    {loading ? (
                        <p>Ładowanie danych...</p>
                    ) : (
                        <PendingVacationTable
                            data={pendingHolidays}
                            columns={['Pracownik', 'Data rozpoczęcia', 'Data zakończenia', 'Typ urlopu', 'Status']}
                            onRowClick={handleRowClick}
                        />
                    )}
                </section>

                <HolidayDetailsModal
                    isOpen={isDetailsModalOpen}
                    holiday={selectedHoliday}
                    onClose={() => setIsDetailsModalOpen(false)}
                />
            </main>
        </div>
    );
};

export default PendingVacationsPage;
