import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import PendingVacationTable from '../../components/PendingVacationTable/PendingVacationTable';
import VacationTable from '../../components/VacationTable/VacationTable';
import './EmployeeDetails.scss';

interface EmployeeDetailsProps {
    employeeId: string;
}

interface EmployeeData {
    name: string;
    surname: string;
    holidays: number;
    holidaysUponRequest: number;
}

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

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId }) => {
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
    const [pendingHolidays, setPendingHolidays] = useState<Holiday[]>([]);
    const [acceptedHolidays, setAcceptedHolidays] = useState<Holiday[]>([]);
    const [loadingEmployee, setLoadingEmployee] = useState<boolean>(true);
    const [loadingHolidays, setLoadingHolidays] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Pobieranie danych pracownika
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setLoadingEmployee(true);
                setError(null);

                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const response = await fetch(`http://localhost:5000/user/data/employee`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ employeeId }), // Przekazanie ID pracownika
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych o pracowniku.');
                }

                const responseData = await response.json();
                const employeeData: EmployeeData = JSON.parse(responseData.message);

                setEmployeeData(employeeData);
            } catch (error: any) {
                console.error('Błąd podczas pobierania danych pracownika:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            } finally {
                setLoadingEmployee(false);
            }
        };

        fetchEmployeeData();
    }, [employeeId]);

    // Pobieranie urlopów pracownika
    useEffect(() => {
        const fetchEmployeeHolidays = async () => {
            try {
                setLoadingHolidays(true);
                setError(null);

                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const response = await fetch('http://localhost:5000/holiday/employee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ employeeId }),
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać urlopów pracownika.');
                }

                const responseData = await response.json();
                const holidaysData: Holiday[] = JSON.parse(responseData.message);

                // Podział urlopów na oczekujące i zrealizowane
                const pending = holidaysData.filter((holiday) => holiday.status === 'pending');
                const accepted = holidaysData.filter((holiday) => 
                    holiday.status === 'accepted' && new Date(holiday.endDate) < new Date()
                );

                setPendingHolidays(pending);
                setAcceptedHolidays(accepted);
            } catch (error: any) {
                console.error('Błąd podczas pobierania urlopów pracownika:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            } finally {
                setLoadingHolidays(false);
            }
        };

        fetchEmployeeHolidays();
    }, [employeeId]);

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

    return (
        <div className="employee-details">
            {/* Sekcja 1: Dane pracownika */}
            {loadingEmployee ? (
                <h1>Ładowanie danych pracownika...</h1>
            ) : error ? (
                <h1 className="error-message">{error}</h1>
            ) : (
                <>
                    <h1>{employeeData?.name} {employeeData?.surname}</h1>
                    <h4>Pozostałe urlopy {employeeData?.holidays ?? 0}/26</h4>
                </>
            )}

            {/* Sekcja 2: Urlopy oczekujące */}
            {loadingHolidays ? (
                <h1>Ładowanie urlopów pracownika...</h1>
            ) : error ? (
                <h1 className="error-message">{error}</h1>
            ) : (
                <>
                    <section className="pending-holidays">
                        <h2>Oczekujące urlopy</h2>
                        <PendingVacationTable
                            data={pendingHolidays}
                            columns={['Pracownik', 'Data rozpoczęcia', 'Data zakończenia', 'Typ urlopu', 'Status']}
                        />
                    </section>

                    {/* Sekcja 3: Urlopy zrealizowane */}
                    <section className="accepted-holidays">
                        <h2>Zrealizowane urlopy</h2>
                        {getMonthlyAcceptedHolidays().map(({ month, holidays }) => (
                            <div key={month}>
                                <h3>{month}</h3>
                                <VacationTable
                                    data={holidays}
                                    columns={['Pracownik', 'Data rozpoczęcia', 'Data zakończenia', 'Typ urlopu']}
                                />
                            </div>
                        ))}
                    </section>
                </>
            )}
        </div>
    );
};

export default EmployeeDetails;
