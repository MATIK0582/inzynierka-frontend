import React from 'react';

interface AddHolidayModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode; // Formularz będzie przekazywany jako dzieci komponentu
}

const AddHolidayModal: React.FC<AddHolidayModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ✖
                </button>
                <h2>Dodaj Urlop</h2>
                {children}
            </div>
        </div>
    );
};

export default AddHolidayModal;
