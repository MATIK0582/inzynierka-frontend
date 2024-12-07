import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { isWithinInterval, parseISO } from 'date-fns';
import HolidayDetailsModal from '../../components/HolidayDetailsModal';
import AddHolidayModal from '../../components/AddHolidayModal';
import holidaysData from '../../mocks/holidays.json';
import AddHolidayForm from '../../components/AddHolidayForm';

interface Holiday {
    startDate: string;
    endDate: string;
    description: string;
    holidayType: string;
    status: string;
}

const CalendarView = () => {
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isAddHolidayModalOpen, setIsAddHolidayModalOpen] = useState(false);

    useEffect(() => {
        setHolidays(holidaysData);
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
            }),
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
                            {holiday.description}
                        </div>
                    ))}
                    {dayHolidays.length > 3 && <div className="holiday-more">+{dayHolidays.length - 3} more</div>}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="calendar-container">
            <div className="header">
                <h1>Kalendarz Urlopów</h1>
                <button className="add-holiday-button" onClick={() => setIsAddHolidayModalOpen(true)}>
                    Dodaj urlop
                </button>
            </div>
            <Calendar locale="pl-PL" calendarType="iso8601" tileContent={getTileContent} />
            <HolidayDetailsModal
                isOpen={isDetailsModalOpen}
                holiday={selectedHoliday}
                onClose={() => setIsDetailsModalOpen(false)}
            />
            <AddHolidayModal isOpen={isAddHolidayModalOpen} onClose={() => setIsAddHolidayModalOpen(false)}>
                <AddHolidayForm onSubmitSuccess={() => console.log('Holiday added successfully')} />
            </AddHolidayModal>
        </div>
    );
};

export default CalendarView;
