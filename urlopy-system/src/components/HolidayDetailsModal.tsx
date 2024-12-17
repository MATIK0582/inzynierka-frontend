import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
// import './HolidayDetailsModal.scss';

interface HolidayDetails {
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

interface DecodedToken {
    id: string;
    role: string;
    exp: number;
}

interface HolidayDetailsModalProps {
    isOpen: boolean;
    holiday: HolidayDetails | null;
    onClose: () => void;
}

const HolidayDetailsModal: React.FC<HolidayDetailsModalProps> = ({ isOpen, holiday, onClose }) => {
    const [userIdFromToken, setUserIdFromToken] = useState<string | null>(null);

    useEffect(() => {
        const accessToken = Cookies.get('access_token');
        if (!accessToken) return;
        
        const decodedToken: DecodedToken = jwtDecode(accessToken);
        setUserIdFromToken(decodedToken.id);
    }, []);

    if (!isOpen || !holiday) return null;

    const handleDeleteHoliday = async () => {
        const confirmation = window.confirm('Czy na pewno chcesz usunąć ten urlop? Tego działania nie można cofnąć.');
        if (!confirmation) return;

        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

            const response = await fetch('http://localhost:5000/holiday/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ holidayId: holiday.id }),
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć urlopu.');
            }

            alert('Urlop został usunięty.');
            window.location.reload();
            onClose();
        } catch (error: any) {
            alert('Wystąpił błąd podczas usuwania urlopu.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ✖
                </button>
                <h2>Detale Urlopu</h2>
                <p>
                    <strong>Okres urlopu:</strong> 
                    <p>{holiday.startDate.replace(/-/g, '/')} - {holiday.endDate.replace(/-/g, '/')}</p>
                </p>
                <p>
                    <strong>Typ urlopu:</strong> 
                    <p>{holiday.holidayType}</p>
                </p>
                <p>
                    <strong>Opis:</strong> 
                    <p>{holiday.description ? holiday.description : 'Brak opisu'}</p>
                </p>
                <p>
                    <strong>Status:</strong> 
                    <p>{holiday.status}</p>
                </p>

                {holiday.status === 'pending' && holiday.userId === userIdFromToken && (
                    <div className="button-group">
                        <button 
                            className="edit-holiday-button" 
                            onClick={() => alert('Funkcja edycji urlopu jeszcze nie jest dostępna.')}
                        >
                            Edytuj urlop
                        </button>
                        <button 
                            className="delete-holiday-button" 
                            onClick={handleDeleteHoliday}
                        >
                            Usuń urlop
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HolidayDetailsModal;
