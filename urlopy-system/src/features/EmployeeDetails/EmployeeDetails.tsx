import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import PendingVacationTable from '../../components/PendingVacationTable/PendingVacationTable';
import VacationTable from '../../components/VacationTable/VacationTable';
import HolidayDetailsModal from '../../components/HolidayDetailsModal';
import './EmployeeDetails.scss';

interface EmployeeDetailsProps {
    employeeId: string;
}

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

interface EmployeeData {
    name: string;
    surname: string;
    holidays: number;
    holidaysUponRequest: number;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId }) => {
    const [employeeData, setEmployeeData] = useState<EmployeeData | null>(null);
    const [pendingHolidays, setPendingHolidays] = useState<Holiday[]>([]);
    const [acceptedHolidays, setAcceptedHolidays] = useState<Holiday[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                setLoading(true);
                setError(null);

                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                // Pobranie danych pracownika
                const responseEmployee = await fetch(`http://localhost:5000/user/data/employee`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ employeeId }),
                });

                if (!responseEmployee.ok) {
                    throw new Error('Nie udało się pobrać danych o pracowniku.');
                }

                const employeeResponseData = await responseEmployee.json();
                const employeeData: EmployeeData = JSON.parse(employeeResponseData.message);
                setEmployeeData(employeeData);

                // Pobranie urlopów pracownika
                const responseHolidays = await fetch('http://localhost:5000/holiday/employee', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ employeeId }),
                });

                if (!responseHolidays.ok) {
                    throw new Error('Nie udało się pobrać urlopów pracownika.');
                }

                const holidaysResponseData = await responseHolidays.json();
                const holidaysData: Holiday[] = JSON.parse(holidaysResponseData.message);

                // Podział urlopów na oczekujące i zrealizowane
                const pending = holidaysData.filter((holiday) => holiday.status === 'pending');
                const accepted = holidaysData.filter((holiday) => 
                    holiday.status === 'accepted' && new Date(holiday.endDate) < new Date()
                );

                setPendingHolidays(pending);
                setAcceptedHolidays(accepted);
            } catch (error: any) {
                console.error('Błąd podczas pobierania danych pracownika:', error);
                setError(error.message || 'Wystąpił nieznany błąd.');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
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

    const handleRowClick = (holiday: Holiday) => {
        setSelectedHoliday(holiday);
        setIsDetailsModalOpen(true);
    };

    return (
        <div className="employee-details">
            {loading ? (
                <h1>Ładowanie danych pracownika...</h1>
            ) : error ? (
                <h1 className="error-message">{error}</h1>
            ) : (
                <>
                    <div className="employee-info">
                        <h1>{employeeData?.name} {employeeData?.surname}</h1>
                        <h4>Pozostałe urlopy {employeeData?.holidays ?? 0}/26</h4>
                    </div>

                    <section className="pending-holidays">
                        <h2>Oczekujące urlopy</h2>
                        <PendingVacationTable
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

export default EmployeeDetails;
