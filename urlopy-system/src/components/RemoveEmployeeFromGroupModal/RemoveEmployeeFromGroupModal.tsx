import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './RemoveEmployeeFromGroupModal.scss';

interface Employee {
    userId: string;
    name: string;
    surname: string;
}

interface RemoveEmployeeFromGroupModalProps {
    isOpen: boolean;
    groupId: string;
    employees: Employee[];
    onEmployeeRemoved: () => void;
    onClose: () => void;
}

const RemoveEmployeeFromGroupModal: React.FC<RemoveEmployeeFromGroupModalProps> = ({ 
    isOpen, 
    groupId, 
    employees, 
    onEmployeeRemoved, 
    onClose 
}) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    const handleRemoveEmployee = async () => {
        if (!selectedEmployeeId) {
            alert('Proszę wybrać pracownika do usunięcia.');
            return;
        }

        const confirmation = window.confirm('Czy na pewno chcesz usunąć tego pracownika z grupy?');
        if (!confirmation) return;

        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

            const response = await fetch('http://localhost:5000/group/member/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ employeeId: selectedEmployeeId, groupId }),
            });

            if (!response.ok) {
                throw new Error('Nie udało się usunąć pracownika z grupy.');
            }

            alert('Pracownik został usunięty z grupy.');
            onEmployeeRemoved();
            onClose();
        } catch (error: any) {
            alert('Wystąpił błąd podczas usuwania pracownika z grupy.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>
                    ✖
                </button>
                <h2>Usuń pracownika z grupy</h2>

                <select 
                    value={selectedEmployeeId || ''} 
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                    <option value="" disabled>Wybierz pracownika do usunięcia</option>
                    {employees.map(employee => (
                        <option key={employee.userId} value={employee.userId}>
                            {employee.name} {employee.surname}
                        </option>
                    ))}
                </select>

                <button className="remove-employee-button" onClick={handleRemoveEmployee}>
                    Usuń pracownika
                </button>
            </div>
        </div>
    );
};

export default RemoveEmployeeFromGroupModal;
