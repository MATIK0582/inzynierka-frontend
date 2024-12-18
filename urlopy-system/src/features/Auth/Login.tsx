import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

import useAuth from '../../hooks/useAuth';
import { EMAIL_REGEX } from '../../utils/validation';

interface LoginFormInputs {
    email: string;
    password: string;
}

const Login = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginFormInputs>();

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                setError('password', { message: errorResponse.message });
                return;
            }

            // Get access token from response header
            const accessToken = response.headers.get('Authorization')?.replace('Bearer ', '');
            if (!accessToken) {
                throw new Error('Brak tokena w odpowiedzi.');
            }

            // Store the access token in cookies
            Cookies.set('access_token', accessToken, {
                secure: true,
                sameSite: 'Strict',
            });

            // Fetch the user profile after login
            const userResponse = await fetch('http://localhost:5000/user/data/own', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!userResponse.ok) {
                throw new Error('Nie udało się pobrać danych użytkownika.');
            }

            const userData = await userResponse.json();
            const userProfile = JSON.parse(userData.message);

            // Store the user's name in localStorage
            localStorage.setItem('userName', `${userProfile.name}`);
            // localStorage.setItem('userName', `${userProfile.name} ${userProfile.surname}`);

            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            setError('email', { message: 'Wystąpił błąd podczas logowania.' });
        }
    };

    return (
        <div className="login-form-wrapper">
            <div className="login-form">
                <h1>Logowanie</h1>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Podaj adres e-mail przypisany do konta"
                            className={errors.email ? 'error' : ''}
                            {...register('email', {
                                required: { value: true, message: 'Email jest wymagany' },
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
                            placeholder="Wprowadź hasło do swojego konta"
                            className={errors.password ? 'error' : ''}
                            {...register('password', { required: 'Hasło jest wymagane' })}
                        />
                        {errors.password && <span className="error-message">{errors.password.message}</span>}
                    </div>

                    <div className="register-link-container">
                        <p>
                            Nie masz konta? <Link to="/register">Zarejestruj się</Link>
                        </p>
                    </div>

                    <button type="submit">Zaloguj się</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
