import React from 'react';

interface HolidayDetails {
    startDate: string;
    endDate: string;
    description: string | null;
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
                    <strong>Okres urlopu:</strong>{' '}
                    <p>
                        {holiday.startDate.replace(/-/g, '/')} - {holiday.endDate.replace(/-/g, '/')}
                    </p>
                </p>
                <p>
                    <strong>Typ urlopu:</strong> <p>{holiday.holidayType}</p>
                </p>
                <p>
                    <strong>Opis:</strong> <p>{holiday.description ? holiday.description : 'Brak opisu'}</p>
                </p>
                <p>
                    <strong>Status:</strong> <p>{holiday.status}</p>
                </p>
            </div>
        </div>
    );
};

export default HolidayDetailsModal;
