import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import PendingVacationTable from '../../components/PendingVacationTable/PendingVacationTable';
import HolidayDetailsModal from '../../components/HolidayDetailsModal';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
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

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
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

                // Decode JWT to get userId and role
                const decodedToken: DecodedToken = jwtDecode(accessToken);
                console.log(decodedToken)
                const currentUserId = decodedToken.id;
                const userRole = decodedToken.role;

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

                let filteredHolidays: Holiday[] = holidaysData.filter((holiday) => holiday.status === 'pending');

                // Filter holidays based on user's role
                if (userRole === 'team_leader' || userRole === 'human_resources') {
                    filteredHolidays = filteredHolidays.filter((holiday) => holiday.userId !== currentUserId);
                }

                // If user is admin, no filtering is applied (all holidays are displayed)
                if (userRole === 'admin') {
                    filteredHolidays = holidaysData.filter((holiday) => holiday.status === 'pending' || holiday.status === 'accepted_by_team_leader');
                }

                setPendingHolidays(filteredHolidays);
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
