import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { HolidayType } from '../utils/holidayTypes';
import { isBefore, parseISO, format } from 'date-fns';
import Cookies from 'js-cookie';

interface AddHolidayFormInputs {
    startDate: string;
    endDate: string;
    holidayType: HolidayType;
    onDemand: boolean;
    description?: string;
}

const AddHolidayForm: React.FC<{ onSubmitSuccess: () => void }> = ({ onSubmitSuccess }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
    } = useForm<AddHolidayFormInputs>({
        defaultValues: {
            holidayType: HolidayType.ANNUAL,
            onDemand: false,
        },
    });

    const startDate = watch('startDate');
    const holidayType = watch('holidayType');

    const today = format(new Date(), 'yyyy-MM-dd');

    React.useEffect(() => {
        if (startDate) {
            setValue('endDate', startDate);
        }
    }, [startDate, setValue]);

    React.useEffect(() => {
        setOnDemandVisible(holidayType === HolidayType.ANNUAL);
        if (holidayType !== HolidayType.ANNUAL) {
            setValue('onDemand', false);
        }
    }, [holidayType, setValue]);

    const [onDemandVisible, setOnDemandVisible] = useState(holidayType === HolidayType.ANNUAL);

    const onSubmit = async (data: AddHolidayFormInputs) => {

        console.log(data);

        try {
            const accessToken = Cookies.get('access_token'); // Pobranie access_token z ciasteczek
            if (!accessToken) {
                throw new Error('Brak tokena dostępu. Proszę się zalogować.');
            }

            const response = await fetch('http://localhost:5000/holiday/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`, // Dodanie tokena do nagłówka
                },
                credentials: 'include', // Uwzględnienie ciasteczek (np. refresh_token)
                body: JSON.stringify({
                    ...data,
                    holidayType: data.onDemand ? HolidayType.ON_DEMAND : data.holidayType,
                }),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error('Błąd:', errorResponse.message);
                return;
            }

            onSubmitSuccess(); // Wywołanie funkcji sukcesu
        } catch (error) {
            console.error('Nie udało się dodać urlopu:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="add-holiday-form">
            <div className="input-group">
                <label htmlFor="startDate">Data początkowa</label>
                <input
                    id="startDate"
                    type="date"
                    className={errors.startDate ? 'error' : ''}
                    {...register('startDate', {
                        required: 'Data początkowa jest wymagana',
                        validate: (value) =>
                            value >= today || 'Data początkowa nie może być w przeszłości',
                    })}
                />
                {errors.startDate && <span className="error-message">{errors.startDate.message}</span>}
            </div>

            <div className="input-group">
                <label htmlFor="endDate">Data końcowa</label>
                <input
                    id="endDate"
                    type="date"
                    className={errors.endDate ? 'error' : ''}
                    {...register('endDate', {
                        required: 'Data końcowa jest wymagana',
                        validate: {
                            notPast: (value) =>
                                value >= today || 'Data końcowa nie może być w przeszłości',
                            afterStart: (value) =>
                                !startDate || value >= startDate || 'Data końcowa musi być równa bądź późniejsza od daty początkowej',
                        },
                    })}
                />
                {errors.endDate && <span className="error-message">{errors.endDate.message}</span>}
            </div>

            <div className="input-group">
                <label htmlFor="holidayType">Typ urlopu</label>
                <select
                    id="holidayType"
                    className={errors.holidayType ? 'error' : ''}
                    {...register('holidayType', { required: 'Typ urlopu jest wymagany' })}
                >
                    <option value={HolidayType.ANNUAL}>Roczny</option>
                    <option value={HolidayType.SICK}>Chorobowy</option>
                </select>
                {errors.holidayType && <span className="error-message">{errors.holidayType.message}</span>}
            </div>

            {onDemandVisible && (
                <div className="input-group">
                    <label className="toggle">
                        <span>Na żądanie</span>
                        <Controller
                            name="onDemand"
                            control={control}
                            render={({ field: { value, ...field } }) => (
                                <input type="checkbox" {...field} checked={value || false} />
                            )}
                        />
                    </label>
                </div>
            )}

            <div className="input-group">
                <label htmlFor="description">Opis</label>
                <textarea
                    id="description"
                    placeholder="Podaj krótkie uzasadnienie (opcjonalne)"
                    className={errors.description ? 'error' : ''}
                    {...register('description')}
                />
            </div>

            <button type="submit">Dodaj urlop</button>
        </form>
    );
};

export default AddHolidayForm;
