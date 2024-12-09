import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate  } from 'react-router-dom';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../utils/validation';

interface RegisterFormInputs {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormInputs>();

    const password = watch('password'); // Obserwacja pola "password" do porównania

    const onSubmit = async (data: RegisterFormInputs) => {
        try {

            console.log(data);

            const response = await fetch('http://localhost:5000/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Error during registration:', errorResponse);
                return;
            }

            console.log('User registered successfully');
            navigate('/login');
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    return (
        <div className="register-form-wrapper">
            <div className="register-form">
                <h1>Rejestracja</h1>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="input-group">
                        <label htmlFor="name">Imię</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Wprowadź swoje imię"
                            className={errors.name ? 'error' : ''}
                            {...register('name', {
                                required: 'Imię jest wymagane',
                            })}
                        />
                        {errors.name && <span className="error-message">{errors.name.message}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="surname">Nazwisko</label>
                        <input
                            id="surname"
                            type="text"
                            placeholder="Wprowadź swoje nazwisko"
                            className={errors.surname ? 'error' : ''}
                            {...register('surname', {
                                required: 'Nazwisko jest wymagane',
                            })}
                        />
                        {errors.surname && <span className="error-message">{errors.surname.message}</span>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Podaj adres e-mail"
                            className={errors.email ? 'error' : ''}
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
                            placeholder="Wprowadź hasło"
                            className={errors.password ? 'error' : ''}
                            {...register('password', {
                                required: 'Hasło jest wymagane',
                                pattern: {
                                    value: PASSWORD_REGEX,
                                    message:
                                        'Hasło musi zawierać cyfrę, dużą literę, znak specjalny (bez spacji) i mieć długość od 8 do 32 znaków.',
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
                            placeholder="Powtórz hasło"
                            className={errors.confirmPassword ? 'error' : ''}
                            {...register('confirmPassword', {
                                required: 'Potwierdzenie hasła jest wymagane',
                                validate: (value) => value === password || 'Hasła muszą być identyczne',
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className="error-message">{errors.confirmPassword.message}</span>
                        )}
                    </div>

                    <div className="login-link-container">
                        <p>
                            Masz już konto? <Link to="/login">Zaloguj się</Link>
                        </p>
                    </div>

                    <button type="submit">Zarejestruj się</button>
                </form>
            </div>
        </div>
    );
};

export default Register;
