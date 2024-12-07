import React from 'react';

interface HolidayDetails {
    startDate: string;
    endDate: string;
    description: string;
    holidayType: string;
    status: string;
}

interface HolidayDetailsModalProps {
    isOpen: boolean;
    holiday: HolidayDetails | null;
    onClose: () => void;
}

const HolidayDetailsModal: React.FC<HolidayDetailsModalProps> = ({ isOpen, holiday, onClose }) => {
    if (!isOpen || !holiday) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ✖
                </button>
                <h2>Detale Urlopu</h2>
                <p>
                    <strong>Okres urlopu:</strong> {holiday.startDate} - {holiday.endDate}
                </p>
                <p>
                    <strong>Typ urlopu:</strong> {holiday.holidayType}
                </p>
                <p>
                    <strong>Opis:</strong> {holiday.description}
                </p>
                <p>
                    <strong>Status:</strong> {holiday.status}
                </p>
            </div>
        </div>
    );
};

export default HolidayDetailsModal;
