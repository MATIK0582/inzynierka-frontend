import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { isWithinInterval, parseISO } from 'date-fns';
import HolidayDetailsModal from '../../components/HolidayDetailsModal';
import AddHolidayModal from '../../components/AddHolidayModal';
import AddHolidayForm from '../../components/AddHolidayForm';
import { getHolidaysForYear } from '../../utils/holidays/getHolidaysForYear';
import Cookies from 'js-cookie';

interface Holiday {
    startDate: string;
    endDate: string;
    description: string;
    holidayType: string;
    status: string;
}

const CalendarView = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [publicHolidays, setPublicHolidays] = useState<Date[]>([]); // Święta publiczne
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const publicHolidaysForYear = getHolidaysForYear(currentYear);
        setPublicHolidays(publicHolidaysForYear);
    }, []);

    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const response = await fetch('http://localhost:5000/holiday/own', {
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
                setHolidays(holidaysData);
            } catch (error) {
                console.error('Błąd podczas pobierania urlopów:', error);
            }
        };

        fetchHolidays();
    }, []);

    const handleHolidayClick = (holiday: Holiday) => {
        setSelectedHoliday(holiday);
        setIsDetailsModalOpen(true);
    };

    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view !== 'month') return null;

        const dayHolidays = holidays.filter((holiday) =>
            isWithinInterval(date, {
                start: parseISO(holiday.startDate),
                end: parseISO(holiday.endDate),
            })
        );

        if (dayHolidays.length > 0) {
            return (
                <div className="holiday-container">
                    {dayHolidays.slice(0, 3).map((holiday, index) => (
                        <div
                            key={index}
                            className={`holiday-indicator ${holiday.status}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleHolidayClick(holiday);
                            }}
                        >
                            {holiday.holidayType}
                        </div>
                    ))}
                    {dayHolidays.length > 3 && <div className="holiday-more">+{dayHolidays.length - 3} więcej</div>}
                </div>
            );
        }

        return null;
    };

    const isPublicHoliday = (date: Date) => {
        return publicHolidays.some(
            (holiday) =>
                holiday.getDate() === date.getDate() &&
                holiday.getMonth() === date.getMonth() &&
                holiday.getFullYear() === date.getFullYear()
        );
    };

    const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view !== 'month') return '';

        if (isPublicHoliday(date)) {
            return 'public-holiday'; // Dodajemy klasę dla święta publicznego
        }

        return '';
    };

    return (
        <div className="calendar-container">
            <div className="header">
                <h1>Kalendarz Urlopów</h1>
                <button className="add-holiday-button" onClick={() => setIsAddHolidayModalOpen(true)}>
                    Dodaj urlop
                </button>
            </div>
            <Calendar
                locale="pl-PL"
                calendarType="iso8601"
                tileContent={getTileContent}
                tileClassName={getTileClassName} // Dodajemy klasę do stylowania
            />
            <HolidayDetailsModal
                isOpen={isDetailsModalOpen}
                holiday={selectedHoliday}
                onClose={() => setIsDetailsModalOpen(false)}
            />
            <AddHolidayModal isOpen={isAddHolidayModalOpen} onClose={() => setIsAddHolidayModalOpen(false)}>
                <AddHolidayForm
                    onSubmitSuccess={() => {
                        console.log('Holiday added successfully');
                        window.location.reload();
                    }}
                />
            </AddHolidayModal>
        </div>
    );
};

export default CalendarView;
