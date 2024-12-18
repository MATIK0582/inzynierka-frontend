import React, { useEffect, useState } from 'react';
import VacationTable from '../../components/VacationTable/VacationTable';
import HolidayDetailsModal from '../../components/HolidayDetailsModal';
import Cookies from 'js-cookie';
import './Profile.scss';

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

interface UserProfile {
    userId: string;
    name: string;
    surname: string;
    groupId: string;
    groupName: string;
    holidays: number;
    holidaysUponRequest: number;
}

const Profile = () => {
    const [pendingHolidays, setPendingHolidays] = useState<Holiday[]>([]);
    const [acceptedHolidays, setAcceptedHolidays] = useState<Holiday[]>([]);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const response = await fetch('http://localhost:5000/user/data/own', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych użytkownika.');
                }

                const responseData = await response.json();
                const userData: UserProfile = JSON.parse(responseData.message);
                setUserProfile(userData);
            } catch (error: any) {
                console.error('Błąd podczas pobierania danych użytkownika:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            }
        };

        const fetchHolidays = async () => {
            try {
                setLoading(true);
                setError(null);

                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const response = await fetch('http://localhost:5000/holiday/own', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych o urlopach.');
                }

                const responseData = await response.json();
                const holidaysData: Holiday[] = JSON.parse(responseData.message);

                const pending = holidaysData.filter((holiday) => holiday.status === 'pending');
                const accepted = holidaysData.filter((holiday) => holiday.status === 'accepted');

                setPendingHolidays(pending);
                setAcceptedHolidays(accepted);
            } catch (error: any) {
                console.error('Błąd podczas pobierania urlopów:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
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
        <div className="profile-page">
            <div className="user-wrapper">
                {loading ? (
                    <h1>Ładowanie danych...</h1>
                ) : userProfile ? (
                    <h1>{userProfile.name} {userProfile.surname}</h1>
                ) : (
                    <h1>Profil użytkownika</h1>
                )}
                <h4>Pozostałe urlopy: {userProfile ? `${userProfile.holidays}/26` : 'Ładowanie...'}</h4>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <p>Ładowanie danych...</p>
            ) : (
                <>
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
                        isOpen={isDetailsModalOpen}
                        holiday={selectedHoliday}
                        onClose={() => setIsDetailsModalOpen(false)}
                    />
                </>
            )}
        </div>
    );
};

export default Profile;
