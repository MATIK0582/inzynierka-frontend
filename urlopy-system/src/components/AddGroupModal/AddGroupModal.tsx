import React, { useEffect, useState } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import Cookies from 'js-cookie';
import './AddGroupModal.scss';

interface AddGroupModalProps {
    onClose: () => void;
    onGroupAdded: (group: any) => void;
}

interface User {
    userId: string;
    name: string;
    surname: string;
    role: string;
}

interface FormInputs {
    name: string;
    leaderId: string;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({ onClose, onGroupAdded }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const accessToken = Cookies.get('access_token');
                if (!accessToken) throw new Error('Brak tokenu dostępu.');

                const response = await fetch('http://localhost:5000/user/data/all', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Nie udało się pobrać danych o użytkownikach.');
                }

                const responseData = await response.json();
                const usersData: User[] = JSON.parse(responseData.message).filter((user: User) => user.role === 'user');
                setUsers(usersData);
            } catch (error: any) {
                setError('Nie udało się pobrać danych o użytkownikach.');
            }
        };

        fetchUsers();
    }, []);

    const onSubmit = async (data: FormInputs) => {
        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');
    
            const response = await fetch('http://localhost:5000/group/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(data),
            });
    
            if (response.status !== 201) {
                const errorResponse = await response.json();
                setError(errorResponse.message || 'Nie udało się dodać grupy.');
                return;
            }

            window.location.reload();
    
            const responseData = await response.json();
            const newGroup = JSON.parse(responseData.message);
    
            onGroupAdded(newGroup);
        } catch (error: any) {
            // setError('Nie udało się dodać grupy.');
            console.log(error);
        }
    };
    

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>✖</button>
                
                <h2>Dodaj grupę</h2>
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Nazwa grupy</label>
                    <input 
                        type="text" 
                        {...register('name', { required: 'Nazwa grupy jest wymagana.' })} 
                    />
                    {errors.name?.message && <p className="error-message">{errors.name?.message as string}</p>}

                    <label>Lider grupy</label>
                    <select {...register('leaderId', { required: 'Wybór lidera jest wymagany.' })}>
                        <option value="">Wybierz lidera</option>
                        {users.map(user => (
                            <option key={user.userId} value={user.userId}>
                                {user.name} {user.surname}
                            </option>
                        ))}
                    </select>
                    {errors.leaderId?.message && <p className="error-message">{errors.leaderId?.message as string}</p>}

                    <button type="submit">Dodaj grupę</button>
                </form>
            </div>
        </div>
    );
};

export default AddGroupModal;
