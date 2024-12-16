// AddEmployeeForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../utils/validation';

interface AddEmployeeFormInputs {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface AddEmployeeFormProps {
    onSuccess: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onSuccess }) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<AddEmployeeFormInputs>();

    const password = watch('password');

    const onSubmit = async (data: AddEmployeeFormInputs) => {
        try {
            const accessToken = Cookies.get('access_token');
            if (!accessToken) throw new Error('Brak tokenu dostępu.');

            const response = await fetch('http://localhost:5000/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error during registration:', errorResponse);
                return;
            }

            onSuccess();
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    return (
        <div className='add-employee-form-wrapper'>
            <form onSubmit={handleSubmit(onSubmit)} className="add-employee-form" noValidate>
                <div className="input-group">
                    <label htmlFor="name">Imię</label>
                    <input id="name" {...register('name', { required: 'Imię jest wymagane' })} />
                    {errors.name && <span className="error-message">{errors.name.message}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor="surname">Nazwisko</label>
                    <input id="surname" {...register('surname', { required: 'Nazwisko jest wymagane' })} />
                    {errors.surname && <span className="error-message">{errors.surname.message}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        {...register('email', {
                            required: 'Email jest wymagany',
                            pattern: { value: EMAIL_REGEX, message: 'Nieprawidłowy format e-mail' },
                        })}
                    />
                    {errors.email && <span className="error-message">{errors.email.message}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor="password">Hasło</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password', {
                            required: 'Hasło jest wymagane',
                            pattern: {
                                value: PASSWORD_REGEX,
                                message: 'Hasło musi zawierać cyfrę, dużą literę, znak specjalny i mieć 8-32 znaków.',
                            },
                        })}
                    />
                    {errors.password && <span className="error-message">{errors.password.message}</span>}
                </div>

                <div className="input-group">
                    <label htmlFor="confirmPassword">Potwierdź hasło</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        {...register('confirmPassword', {
                            required: 'Potwierdzenie hasła jest wymagane',
                            validate: (value) => value === password || 'Hasła muszą być identyczne',
                        })}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
                </div>

                <button type="submit">Dodaj pracownika</button>
            </form>
        </div>
    );
};

export default AddEmployeeForm;
