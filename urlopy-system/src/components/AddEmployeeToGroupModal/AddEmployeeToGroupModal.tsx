import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import './AddEmployeeToGroupModal.scss';

interface FormInputs {
    employeeId: string;
}

interface User {
    userId: string;
    name: string;
    surname: string;
    role: string;
}

interface AddEmployeeToGroupModalProps {
    groupId: string;
    onEmployeeAdded: () => void;
    onClose: () => void;
}

const AddEmployeeToGroupModal: React.FC<AddEmployeeToGroupModalProps> = ({ groupId, onEmployeeAdded, onClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const response = await fetch('http://localhost:5000/user/data/all', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const responseData = await response.json();
                const usersData: User[] = JSON.parse(responseData.message).filter((user: User) => user.role === 'user');
                setUsers(usersData);
            } catch (error) {
                setError('Nie udało się pobrać danych o użytkownikach.');
            }
        };

        fetchUsers();
    }, []);

    const onSubmit = async (data: FormInputs) => {
        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

            const response = await fetch('http://localhost:5000/group/member/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ groupId, employeeId: data.employeeId }),
            });

            if (response.status !== 201) {
                const errorResponse = await response.json();
                setError(errorResponse.message || 'Nie udało się dodać pracownika do grupy.');
                return;
            }

            onEmployeeAdded();
        } catch (error) {
            setError('Nie udało się dodać pracownika do grupy.');
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>✖</button>
                <h2>Dodaj Pracownika do Grupy</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <select {...register('employeeId', { required: 'Wybór pracownika jest wymagany.' })}>
                        <option value="">Wybierz pracownika</option>
                        {users.map(user => (
                            <option key={user.userId} value={user.userId}>
                                {user.name} {user.surname}
                            </option>
                        ))}
                    </select>
                    {errors.employeeId && <p className="error-message">{errors.employeeId.message}</p>}
                    <button type="submit">Dodaj pracownika</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeToGroupModal;
