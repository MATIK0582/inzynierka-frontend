import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Vacations from './Vacations';
import './VacationsPage.scss';

const VacationsPage: React.FC = () => {
    return (
        <div className="home-page">
            <Navbar />
            <main className="main-content">
                <Vacations />
            </main>
        </div>
    );
};

export default VacationsPage;
