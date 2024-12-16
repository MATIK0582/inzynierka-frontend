// AddEmployeeModal.tsx
import React from 'react';
import AddEmployeeForm from '../AddEmployeeForm/AddEmployeeForm';
import './AddEmployeeModal.scss';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSuccess }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ✖
                </button>
                <h2>Dodaj Pracownika</h2>
                <AddEmployeeForm onSuccess={onSuccess} />
            </div>
        </div>
    );
};

export default AddEmployeeModal;
